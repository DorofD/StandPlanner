# # Запускать из терминала:
# # uvicorn sp_rocket_bot.main:bot_app --host 0.0.0.0 --port 5060
import threading
import queue
from websocket import WebSocketApp
import redis
from fastapi import FastAPI
from contextlib import asynccontextmanager
from sp_rocket_bot.external_interfaces.rocket_ws_client import RocketChatWSClient

channels = [
    {'rid': '68ce03dbf531ef2b877926b6',
        'name': 'sp_test_private_channel', 'type': 'group'},
    {'rid': '6890d0fd169b88fc700cc5fa', 'name': 'sp_test', 'type': 'channel'},
    {'rid': '68cd4b11de482d41e3b557ce', 'name': 'sp_test2', 'type': 'channel'},
    {'rid': '68cd4b4d70869ceac01f61e0', 'name': 'sp_test3', 'type': 'channel'}
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    ws_client = RocketChatWSClient()
    ws_client.connect(channels)
    # ws_client.start_redis_worker(redis_channel="websocket_messages")
    app.state.ws_client = ws_client
    yield
    ws_client.stop()

bot_app = FastAPI(lifespan=lifespan)


@bot_app.get("/")
def root():
    return {"status": "running"}


# import threading
# import queue
# from websocket import WebSocketApp
# import redis
# from fastapi import FastAPI
# from sp_rocket_bot.external_interfaces.rocket_ws_client import RocketChatWSClient

# ws_client = RocketChatWSClient()

# bot_app = FastAPI()
# channels = [
#     {'rid': '68ce03dbf531ef2b877926b6',
#             'name': 'sp_test_private_channel', 'type': 'group'},
#     {'rid': '6890d0fd169b88fc700cc5fa', 'name': 'sp_test', 'type': 'channel'},
#     {'rid': '68cd4b11de482d41e3b557ce', 'name': 'sp_test2', 'type': 'channel'},
#     {'rid': '68cd4b4d70869ceac01f61e0', 'name': 'sp_test3', 'type': 'channel'}
# ]


# @bot_app.on_event("startup")
# def startup_event():
#     ws_client = RocketChatWSClient()
#     ws_client.connect(channels)

#     ws_client.start_redis_worker(redis_channel="websocket_messages")
#     bot_app.state.ws_client = ws_client


# @bot_app.on_event("shutdown")
# def shutdown_event():
#     client = bot_app.state.ws_client
#     client.stop()


# @bot_app.get("/")
# def root():
#     return {"status": "running"}
