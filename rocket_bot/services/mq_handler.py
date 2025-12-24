import threading
from queue import Empty
from external_interfaces.redis_api import RedisApi
from services.logger import logger
from services.messages import MessageHandler


class MessageQueueHandler:
    def __init__(self):
        self._running = False
        self._thread = None
        self.local_queue = None
        self.redis = RedisApi()
        self.mh = MessageHandler()

    def _listen_queue(self):
        while self._running:
            try:
                message = self.local_queue.get(timeout=2)
                # handled_message = self.rh.handle_reservation(message)
                handled_message = self.mh.handle_message(message)
                if not handled_message['success']:
                    logger.error(
                        f"mq_handler: Unknown error in handled_message: {handled_message['error']}")
                    message['handle_status'] = {
                        'success': False, 'error': {handled_message['error']}}
                    self._push_to_redis_queue(
                        'rocket_messages_failed', message)
                    continue
                if not handled_message['action']:
                    message['handle_status'] = {
                        'success': True, 'message': {handled_message['message']}}
                    self._push_to_redis_queue(
                        'rocket_messages_succeed', message)
                    continue
                if handled_message['event']:
                    message['handle_status'] = {
                        'success': True, 'message': {handled_message['message']}}
                    self._push_to_redis_queue(
                        'rocket_messages_succeed', message)
                    self._push_to_redis_queue(
                        'rocket_events', handled_message['event'])
            except Empty:
                continue
            except Exception as e:
                logger.error(f"mq_handler: Unknown error {e}")
                continue

    def _push_to_redis_queue(self, queue_name, message):
        return self.redis.push_message_to_queue(queue_name, message)

    def run(self, local_msg_queue):
        self.local_queue = local_msg_queue
        if not self._running:
            self._running = True
            logger.info(
                f"mq_handler: start listen ws_message_queue (local queue)")
            print("Starting mq_handler")
            self._thread = threading.Thread(
                target=self._listen_queue, daemon=True)
            self._thread.start()

    def stop(self):
        logger.info(
            f"mq_handler: stopping")
        print("Stopping mq_handler")
        self._running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=5)
