from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from websocket_manager import manager
from sqlalchemy import select
from database import AsyncSessionLocal
import models
import os
from jose import jwt
from dotenv import load_dotenv

load_dotenv()

ws_router = APIRouter(prefix='/ws', tags=['websocket'])

@ws_router.websocket("/session/{session_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: int,
    token: str = Query(...)
):
    await websocket.accept()
    
    try:
        SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
        ALGORITHM = "HS256"
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        
        if not user_id:
            await websocket.close(code=1008)
            return
        
        async with AsyncSessionLocal() as db:
            stmt = select(models.Session_Participant).where(
                models.Session_Participant.user_id == user_id,
                models.Session_Participant.session_id == session_id
            )
            participant = (await db.execute(stmt)).scalar_one_or_none()
            
            if participant is None:
                await websocket.close(code=1008)
                return
        
        await manager.connect(session_id, websocket)
        
        while True:
            # Просто держим соединение открытым, ждем сообщения
            data = await websocket.receive_text()
            # Можно обработать пинг-понг или другие сообщения от клиента
            
    except WebSocketDisconnect:
        manager.disconnect(session_id, websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        try:
            await websocket.close(code=1011)
        except:
            pass