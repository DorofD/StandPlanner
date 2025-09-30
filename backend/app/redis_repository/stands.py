from app.redis_repository import RedisBase


class RedisStands(RedisBase):
    def set_stand(self, stand_uuid, name, status='Unknown', last_modified_by='default'):
        stand_key = f'stand:{stand_uuid}'
        self.r.hset(stand_key, mapping={
            'uuid': stand_uuid,
            'name': name,
            'status': status,
            'last_modified_by': last_modified_by
        })
        return self.r.sadd('stands:all', stand_uuid)

    def get_all_stand_uuids(self):
        return [uuid for uuid in self.r.smembers('stands:all')]

    def get_all_stands(self):
        result = []
        for uuid in self.get_all_stand_uuids():
            stand = self.r.hgetall(f'stand:{uuid}')
            stand['queue'] = self.r.lrange(f'stand:{uuid}:queue', 0, -1)
            result.append(stand)
        return result

    def delete_stand(self, stand_uuid):
        key = f'stand:{stand_uuid}'
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.delete(key), self.r.delete(queue_key)

    def add_user_to_stand_queue(self, stand_uuid, user):
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.rpush(queue_key, user)

    def get_stand_queue(self, stand_uuid):
        queue_key = f'stand_queue:{stand_uuid}:queue'
        return self.r.lrange(queue_key, 0, -1)

    def delete_stand_queue(self, stand_uuid):
        queue_key = f'stand:{stand_uuid}:queue'
        return self.r.delete(queue_key)
