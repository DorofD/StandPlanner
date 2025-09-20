from fastapi import FastAPI, BackgroundTasks
import asyncio

from rocket_bot.bot import RocketBot

app = FastAPI()
bot = RocketBot()


@app.on_event("startup")
async def startup_event():
    # Запускаем фоновую задачу слушателя вебсокета
    loop = asyncio.get_event_loop()
    loop.create_task(bot.listen_websocket())


@app.get("/status")
async def status():
    return {"status": bot.get_status()}


@app.post("/messages")
async def send_message():
    result = bot.send_test_message()
    return {"result": result}
