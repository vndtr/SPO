from fastapi import APIRouter, Depends, Request, Query
from fastapi.exceptions import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import crud
import schemas
import models
from deps import get_session
from websocket_manager import manager

answer_router = APIRouter(prefix="/answer", tags=["answer"])

@answer_router.post('/create')
async def add_session_answer(
    answer: schemas.AnswerCreate,
    request: Request,
    db: AsyncSession = Depends(get_session)
):
    user = request.state.user
    
    result = await crud.create_answer(answer, user.id, db)
    
    await manager.broadcast(
        session_id=answer.session_id,
        message={
            "type": "answer_created",
            "answer_id": result.id,
            "note_id": answer.note_id,
            "session_id": answer.session_id,
            "action": "reload"
        }
    )
    
    return result

@answer_router.get('/')
async def get_session_answers(
    note_id: int,
    request: Request,
    db: AsyncSession = Depends(get_session)
):
    user = request.state.user
    
    # Находим заметку
    stmt_note = select(models.Session_Note).where(models.Session_Note.id == note_id)
    note = (await db.execute(stmt_note)).scalar_one_or_none()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Проверяем, что пользователь участник сессии и получаем его роль
    stmt_participant = select(models.Session_Participant).where(
        models.Session_Participant.user_id == user.id,
        models.Session_Participant.session_id == note.session_id
    )
    current_participant = (await db.execute(stmt_participant)).scalar_one_or_none()
    
    if not current_participant:
        raise HTTPException(status_code=403, detail="Access denied")
    
    current_role = "teacher" if current_participant.role_id == 2 else "student"
    
    # Получаем все ответы на заметку
    stmt_answers = select(models.Answer).where(models.Answer.note_id == note_id)
    answers = (await db.execute(stmt_answers)).scalars().all()
    
    # Форматируем ответы с фильтрацией по роли
    result = []
    for answer in answers:
        # Получаем информацию об авторе ответа
        stmt_answer_participant = select(models.Session_Participant).where(
            models.Session_Participant.id == answer.participant_id
        )
        answer_participant = (await db.execute(stmt_answer_participant)).scalar_one_or_none()
        
        if not answer_participant:
            continue
        
        stmt_user = select(models.User).where(models.User.id == answer_participant.user_id)
        answer_user = (await db.execute(stmt_user)).scalar_one_or_none()
        
        answer_role = "teacher" if answer_participant.role_id == 2 else "student"
        
        # Фильтрация:
        # - Учитель видит все ответы
        # - Ученик видит только ответы учителей и свои ответы
        if current_role == "teacher":
            show_answer = True
        else:  # student
            is_own_answer = answer_participant.user_id == user.id
            is_teacher_answer = answer_role == "teacher"
            show_answer = is_own_answer or is_teacher_answer
        
        if show_answer:
            result.append({
                "id": answer.id,
                "content": answer.content,
                "note_id": answer.note_id,
                "participant_id": answer.participant_id,
                "created_at": answer.created_at.isoformat() if answer.created_at else None,
                "author": {
                    "id": answer_user.id if answer_user else None,
                    "name": f"{answer_user.name} {answer_user.last_name}".strip() if answer_user else "Unknown",
                    "role": answer_role
                }
            })
    
    return result

@answer_router.patch('/update')
async def update_session_answer(
    answer: schemas.AnswerUpdate,
    request: Request,
    db: AsyncSession = Depends(get_session)
):
    user = request.state.user
    result = await crud.update_session_answer(answer, user.id, db)
    
    await manager.broadcast(
        session_id=answer.session_id,
        message={
            "type": "answer_updated",
            "answer_id": answer.id,
            "note_id": answer.note_id,
            "session_id": answer.session_id,
            "action": "reload"
        }
    )
    
    return result

@answer_router.post('/delete')
async def delete_session_answer(
    answer: schemas.AnswerDelete,
    request: Request,
    db: AsyncSession = Depends(get_session)
):
    user = request.state.user
    result = await crud.delete_session_answer(answer, user.id, db)
    
    await manager.broadcast(
        session_id=answer.session_id,
        message={
            "type": "answer_deleted",
            "answer_id": answer.id,
            "note_id": answer.note_id,
            "session_id": answer.session_id,
            "action": "reload"
        }
    )
    
    return result