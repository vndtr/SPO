from fastapi import APIRouter, Depends, File, Request, Form, Query
from fastapi.exceptions import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import crud
import schemas, models
from deps import get_session
from .auth_router import get_current_user

solo_session_router = APIRouter(prefix="/solo_session", tags=["solo_session"])

@solo_session_router.post('/create')
async def create_solo_session(
    request:Request,
    book_id:int = Query(...),
    db:AsyncSession = Depends(get_session)):
    return await crud.create_solo_session(request.state.user,book_id, db)



@solo_session_router.get('/')
async def get_solo_session(
        request:Request,
        book_id:int = Query(None),
        db:AsyncSession = Depends(get_session)):
    return await crud.get_solo_session(request.state.user.id,book_id, db)
    