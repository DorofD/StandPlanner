# # Запускать из терминала:
# # uvicorn main:bot_app --host 0.0.0.0 --port 5060
import asyncio
import socket
import datetime
import queue
from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from external_interfaces.rocket_ws_client import RocketChatWSClient
from external_interfaces.rocket_http_api import RocketChatAPI
from services.mq_handler import MessageQueueHandler
from services.logger import logger, get_formatted_uptime
ws_lock = asyncio.Lock()
local_message_queue = queue.Queue(maxsize=1000)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Rocket bot started")
    logger.info("Settings uploaded successfully")

    mq_handler = MessageQueueHandler()
    mq_handler.run(local_message_queue)
    ws_client = RocketChatWSClient()
    ws_client.run(local_message_queue)
    yield

    logger.info("Shutting down")
    ws_client = getattr(app.state, "ws_client", None)
    if ws_client:
        ws_client.stop()
    mq_handler = getattr(app.state, "mq_handler", None)
    if mq_handler:
        mq_handler.stop()

bot_app = FastAPI(lifespan=lifespan)


@bot_app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


@bot_app.get("/")
def root():
    hostname = socket.gethostname()

    try:
        with open("/proc/uptime") as f:
            uptime_seconds = float(f.readline().split()[0])
        hours, remainder = divmod(int(uptime_seconds), 3600)
        minutes, seconds = divmod(remainder, 60)
        uptime_str = f"{hours}h {minutes}m {seconds}s"
    except Exception as e:
        uptime_str = "unknown"

    formatted_now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {
        'success': True,
        "hostname": hostname,
        "uptime": uptime_str,
        "now": formatted_now
    }


@bot_app.get("/status")
def show_status(request: Request):
    return 200


# @bot_app.get("/reload")
# async def reload(request: Request):
#     logger.info("Reload by API request")

#     # остановить клиенты
#     ws_client = getattr(request.app.state, "ws_client", None)
#     if ws_client:
#         ws_client.stop()
#     mq_handler = getattr(request.app.state, "mq_handler", None)
#     if mq_handler:
#         mq_handler.stop()

#     # загрузить настройки заново
#     settings = get_settings()
#     request.app.state.settings = settings

#     if settings['success']:
#         logger.info("Settings reloaded successfully")
#         mq_handler = MessageQueueHandler()
#         mq_handler.connect()
#         request.app.state.mq_handler = mq_handler
#         ws_client = RocketChatWSClient()
#         ws_client.connect(settings['target_rooms'])
#         request.app.state.ws_client = ws_client
#         return {"success": True, "message": "Reloaded successfully"}
#     else:
#         request.app.state.ws_client = None
#         request.app.state.mq_handler = None
#         logger.info(f"Can't load settings: {settings['error']}")
#         return {"success": False, "error": settings['error']}


@bot_app.get("/rocket_data")
def get_rocket_data(value: str):
    if not value:
        return {'success': False, 'message': 'Enter value to search'}
    r_api = RocketChatAPI()
    if value == 'rooms':
        rooms = r_api.get_rooms()
        return {'success': True, 'rooms': rooms}
