import threading
from shared .queues import ws_message_queue
from queue import Empty
from external_interfaces.redis_api import RedisApi
from services.logger import logger, get_formatted_uptime
from services.reservations import ReservationsHandler


class MessageQueueHandler:
    def __init__(self):
        self._count = 0
        self._running = False
        self._thread = None
        self.redis = RedisApi()
        self.r
        # self.start_time = 0

    def _listen_queue(self):
        while self._running:
            try:
                message = ws_message_queue.get(timeout=2)
                handled_message = self._handle_message(message)
                if not handled_message['success']:
                    logger.error(
                        f"mq_handler: Unknown error in handled_message: {handled_message['error']}")
                    message['handle_status'] = {
                        'success': False, 'error': {handled_message['error']}}
                    self._count += 1
                    self._push_to_redis_queue(
                        'rocket_messages_failed', message)
                    continue
                if not handled_message['action']:
                    message['handle_status'] = {
                        'success': True, 'message': {handled_message['message']}}
                    self._count += 1
                    self._push_to_redis_queue(
                        'rocket_messages_succeed', message)
                    continue
                if handled_message['event']:
                    message['handle_status'] = {
                        'success': True, 'message': {handled_message['message']}}
                    self._count += 1
                    self._push_to_redis_queue(
                        'rocket_messages_succeed', message)
                    self._push_to_redis_queue(
                        'rocket_events', handled_message['event'])

                    # if not handled_message['success']:

                    #     if handled_message['action']
            except Empty:
                continue
            except Exception as e:
                logger.error(f"mq_handler: Unknown error {e}")
                continue

    def _push_to_redis_queue(self, queue_name, message):
        return self.redis.push_message_to_queue(queue_name, message)

    def _set_stand_status(self, stand_uuid, status, author):
        return self.redis.set_stand(stand_uuid, status, author)

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
