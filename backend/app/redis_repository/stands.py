from app.redis_repository import RedisBase


class RedisStands(RedisBase):
    def set_stand(self, stand_uuid, name='', status='Unknown', busy_by=''):
        stand_key = f'stand:{stand_uuid}'
        return self.r.hset(stand_key, mapping={
            'stand_uuid': stand_uuid, "name": name, 'status': status, 'busy_by': busy_by})

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
