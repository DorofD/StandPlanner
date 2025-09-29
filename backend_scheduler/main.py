# # Запускать из терминала:
# # uvicorn main:bot_app --host 0.0.0.0 --port 5060
import asyncio
from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from external_interfaces.rocket_ws_client import RocketChatWSClient
from external_interfaces.main_app_api import MainAppAPI
from services.health_checks import get_status
from services.mq_handler import MessageQueueHandler
from services.logger import logger
ws_lock = asyncio.Lock()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Let's get started")
    mq_handler = MessageQueueHandler()
    mq_handler.connect()
    app.state.mq_handler = mq_handler

    settings = MainAppAPI().get_settings()
    app.state.settings = settings
    if settings:
        logger.info("Settings uploaded successfully")
        ws_client = RocketChatWSClient()
        ws_client.connect(settings['target_rooms'])
        app.state.ws_client = ws_client
        yield
    else:
        app.state.ws_client = None
        logger.info("Can't load settings")
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
    return {"message": "Hello There"}


@bot_app.get("/status")
def show_status(request: Request):
    result = {'success': True}
    ws_client = request.app.state.ws_client
    if ws_client:
        result['ws_client'] = ws_client.status
    else:
        result['ws_client'] = {"alive": False}

    mq_handler = request.app.state.mq_handler
    if mq_handler:
        result['mq_handler'] = mq_handler.status
    else:
        result['mq_handler'] = {"alive": False}
    return result


@bot_app.get("/settings")
async def show_settings(request: Request):
    return request.app.state.settings


@bot_app.get("/restart")
async def restart(request: Request):
    logger.info("Restarting by API request")
    async with ws_lock:
        settings = MainAppAPI().get_settings()
        request.app.state.settings = settings
        if settings:
            ws_client = request.app.state.ws_client
            if ws_client:
                ws_client.stop()
            await asyncio.sleep(2)
            new_client = RocketChatWSClient()
            new_client.connect(settings['target_rooms'])
            request.app.state.ws_client = new_client
        else:
            logger.info("Can't load settings")
            return {"message": "can't get settings"}
    return {"message": "restarted"}
