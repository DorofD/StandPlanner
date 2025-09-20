import redis
import os
from dotenv import load_dotenv


class RedisBase:
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
