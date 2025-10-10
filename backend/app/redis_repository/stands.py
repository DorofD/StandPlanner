from app.redis_repository import RedisBase


class RedisStands(RedisBase):
    def __init__(self):
        super().__init__()

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

    def get_all_stands(self):
        """
        Возвращает список словарей {uuid: {name: .., status: .., ...}}
        """
        uuids = self.get_all_stands_uuids()
        pipe = self.r.pipeline()
        # добавляем все команды redis в пайплайн
        for uuid in uuids:
            pipe.hgetall(f'stand:{uuid}')
            pipe.lrange(f'stand:{uuid}:queue', 0, -1)
        # выполняем все команды за один сетевой запрос
        results = pipe.execute()
        result = {}
        for i, uuid in enumerate(uuids):
            stand = results[i*2]
            stand['queue'] = results[i*2+1]
            result[stand['uuid']] = stand
        return result

    def get_stand(self, stand_uuid):
        key = f'stand:{stand_uuid}'
        return self.r.hgetall(key)

    def delete_stand(self, stand_uuid):
        key = f'stand:{stand_uuid}'
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.delete(key), self.r.delete(queue_key)

    def add_user_to_stand_queue(self, stand_uuid, user):
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.rpush(queue_key, user)

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

    def get_stand_queue(self, stand_uuid):
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.lrange(queue_key, 0, -1)

    def delete_stand_queue(self, stand_uuid):
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.delete(queue_key)


# RedisStands().add_user_to_stand_queue(
#     '03346474-1460-4820-adaf-486c6c2783ad', 'someUser1')
# for i in RedisStands().get_stand_queue('03346474-1460-4820-adaf-486c6c2783ad'):
#     print(i)
# for i in RedisStands().get_all_stands():
#     print(i)
# print(RedisStands().delete_user_from_stand_queue_by_username(
#     '03346474-1460-4820-adaf-486c6c2783ad', 'someUser1'))
# print(RedisStands().get_stand_queue(
#     '03346474-1460-4820-adaf-486c6c2783ad'))


# print(RedisApi().add_user_to_stand_queue(
#     '04211380-2588-44b0-9c22-39d4eed46c15', 'Bobe1'))
# print(RedisApi().add_user_to_stand_queue(
#     '04211380-2588-44b0-9c22-39d4eed46c15', 'Bobe2'))
# for i in RedisApi().get_all_stands():
#     print(i)
# for i in RedisApi().get_all_stands():
#     print(i)
