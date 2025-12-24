
import redis
import os
import json
from datetime import datetime, timezone
from dotenv import load_dotenv
from services.logger import logger


class RedisApi:
    def __init__(self):
        load_dotenv('.env')
        redis_host = os.environ['REDIS_HOST']
        redis_port = os.environ['REDIS_PORT']
        self.redis_url = f"redis://{redis_host}:{redis_port}/0"
        self.r = redis.Redis.from_url(self.redis_url, decode_responses=True)

    def check_redis(self):
        try:
            pong = self.r.ping()
            return pong
        except redis.ConnectionError as e:
            return False

    def push_message_to_queue(self, queue_name, message: dict):
        msg_str = json.dumps(message)
        try:
            result = self.r.rpush(queue_name, msg_str)
            return result > 0   # True если добавлено
        except redis.RedisError as e:
            logger.error(f"Redis error: {e}")
            return False

    def add_event(self, action_type, action_name, action_details):
        event = {
            'datetime': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S'),
            'action_type': action_type,
            'action_name': action_name,
            'action_details': action_details
        }
        self.r.lpush(self.key, json.dumps(event))
        self.r.ltrim(self.key, 0, self.max_events - 1)
