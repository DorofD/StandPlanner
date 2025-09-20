
import redis
import os
from dotenv import load_dotenv


class RedisExecutor:
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

    def set_stand(self, stand_uuid, status='Unknown', busy_by=''):
        stand_key = f'stand:{stand_uuid}'
        return self.r.hset(stand_key, mapping={
            'stand_uuid': stand_uuid, 'status': status, 'busy_by': busy_by})

    def get_stand(self, stand_uuid):
        key = f'stand:{stand_uuid}'
        return self.r.hgetall(key)

    def get_all_stands(self):
        keys = self.r.keys('stand:*')
        return [self.r.hgetall(k) for k in keys]

    def delete_stand(self, stand_uuid):
        key = f'stand:{stand_uuid}'
        return self.r.delete(key)

    def add_user_to_stand_queue(self, stand_uuid, user):
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.rpush(queue_key, user)

    def get_stand_queue(self, stand_uuid):
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.lrange(queue_key, 0, -1)

    def delete_stand_queue(self, stand_uuid):
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.delete(queue_key)
