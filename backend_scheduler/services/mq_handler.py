import threading
from shared .queues import ws_message_queue
from queue import Empty
from datetime import datetime
from external_interfaces.redis_api import RedisApi
from services.logger import logger, get_formatted_uptime


class MessageQueueHandler:
    def __init__(self):
        self._count = 0
        self._running = False
        self._thread = None
        self.redis = RedisApi()
        # self.start_time = 0

    def _listen_queue(self):
        while self._running:
            try:
                message = ws_message_queue.get(timeout=2)
                self._count += 1
                self.redis.push_message_to_queue('rocket_messages', message)
                # print(
                #     f"Message received: {message}. Total messages processed: {self._counter}")
            except Empty:
                continue
            except Exception as e:
                logger.error(f"mq_handler: Unknown error {e}")
                # print(f"Error when handle queue message: {e}")
                continue

    def connect(self):
        # self.start_time = datetime.now()
        if not self._running:
            logger.info(
                f"mq_handler: start listen ws_message_queue (local queue)")
            self._running = True
            self._thread = threading.Thread(
                target=self._listen_queue, daemon=True)
            self._thread.start()

    def stop(self):
        logger.info(
            f"mq_handler: stopping")
        # print("Stopping mq_handler")
        self._running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=5)

    @property
    def status(self):
        return {
            "alive": True,
            "message_count": self._count
        }

    # @property
    # def get_status(self):
    #     if self.start_time == 0:
    #         uptime = False
    #     else:
    #         now = datetime.now()
    #         uptime = get_formatted_uptime(
    #             self.start_time, now)
    #     result = {"alive": True,
    #               "message_count": self._count, "uptime": uptime, }
    #     return result
