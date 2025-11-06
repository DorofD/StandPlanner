
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

    def set_stand(self, stand_uuid, name, status='Unknown', last_modified_by='default'):
        stand_key = f'stand:{stand_uuid}'
        self.r.hset(stand_key, mapping={
            'uuid': stand_uuid,
            'name': name,
            'status': status,
            'last_modified_by': last_modified_by
        })
        return self.r.sadd('stands:all', stand_uuid)

    def get_all_stands_uuids(self):
        return [uuid for uuid in self.r.smembers('stands:all')]

    # def get_all_stands(self):
    #     result = []
    #     for uuid in self.get_all_stands_uuids():
    #         stand = self.r.hgetall(f'stand:{uuid}')
    #         stand['queue'] = self.r.lrange(f'stand:{uuid}:queue', 0, -1)
    #         result.append(stand)
    #     return result

    def get_all_stands(self):
        uuids = self.get_all_stands_uuids()
        pipe = self.r.pipeline()
        # добавляем все команды redis в пайплайн
        for uuid in uuids:
            pipe.hgetall(f'stand:{uuid}')
            pipe.lrange(f'stand:{uuid}:queue', 0, -1)
        # выполняем все команды за один сетевой запрос
        results = pipe.execute()
        result = []
        for i, uuid in enumerate(uuids):
            stand = results[i*2]
            stand['queue'] = results[i*2+1]
            result.append(stand)
        return result

    def delete_stand(self, stand_uuid):
        key = f'stand:{stand_uuid}'
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.delete(key), self.r.delete(queue_key)

    def get_stand(self, stand_uuid):
        key = f'stand:{stand_uuid}'
        stand = self.r.hgetall(key)
        stand['queue'] = self.get_stand_queue(stand_uuid['uuid'])
        return stand

    def add_user_to_stand_queue(self, stand_uuid, username):
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.rpush(queue_key, username)

    def get_stand_queue(self, stand_uuid):
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.lrange(queue_key, 0, -1)

    def delete_stand_queue(self, stand_uuid):
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.delete(queue_key)

    def delete_first_user_from_stand_queue(self, stand_uuid):
        """Возвращает удалённое значение"""
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.lpop(queue_key)

    def delete_user_from_stand_queue_by_username(self, stand_uuid, username, all=True):
        """
        all = True удаляет все вхождения, False - только первое
        Возвращает число удаленных записей
        """
        queue_key = f'stand:{stand_uuid}:queue'
        if all:
            return self.r.lrem(queue_key, 0, username)
        return self.r.lrem(queue_key, 1, username)

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


# RedisApi().add_user_to_stand_queue(
#     '04211380-2588-44b0-9c22-39d4eed46c15', 'edorofeev12')
# RedisApi().add_user_to_stand_queue(
#     '04211380-2588-44b0-9c22-39d4eed46c15', 'billibiobov324')
# RedisApi().add_user_to_stand_queue(
#     '04211380-2588-44b0-9c22-39d4eed46c15', 'billibiobov324')
# RedisApi().add_user_to_stand_queue(
#     '04211380-2588-44b0-9c22-39d4eed46c15', 'billibiobov324')
# RedisApi().add_user_to_stand_queue(
#     '04211380-2588-44b0-9c22-39d4eed46c15', 'billibiobov324')
# RedisApi().add_user_to_stand_queue(
#     '04211380-2588-44b0-9c22-39d4eed46c15', 'billibiobov324')
# print('---', RedisApi().delete_user_from_stand_queue_by_username(
#     '04211380-2588-44b0-9c22-39d4eed46c15', "billibiobov324", False), '---')
# s_q = RedisApi().get_stand_queue('04211380-2588-44b0-9c22-39d4eed46c15')
# for i in s_q:
#     print(i)


# print(RedisApi().add_user_to_stand_queue(
#     '04211380-2588-44b0-9c22-39d4eed46c15', 'Bobe1'))
# print(RedisApi().add_user_to_stand_queue(
#     '04211380-2588-44b0-9c22-39d4eed46c15', 'Bobe2'))
# for i in RedisApi().get_all_stands():
#     print(i)
# for i in RedisApi().get_all_stands():
#     print(i)

# print(RedisApi().get_stand_queue(
#     '03346474-1460-4820-adaf-486c6c2783ad'))
