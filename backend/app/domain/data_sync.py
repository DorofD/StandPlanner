from app.repository.queries.stands import DBStands
from app.redis_repository.stands import RedisStands


class DataSyncManager():
    def __init__(self):
        self.db_s = DBStands()
        self.redis_s = RedisStands()

    def push_stands_to_redis(self):
        local_uuids_list = self.db_s.get_uuids_list()
        local_uuids_names_dict = self.db_s.get_uuids_to_names_dict()
        redis_stands = self.redis_s.get_all_stand_uuids()
        deleted_count = 0
        for r_uuid in redis_stands:
            if r_uuid not in local_uuids_list:
                self.redis_s.delete_stand(r_uuid)
                deleted_count += 1
        added_count = 0
        for l_uuid in local_uuids_list:
            if l_uuid not in redis_stands:
                self.redis_s.set_stand(l_uuid, local_uuids_names_dict[l_uuid])
                added_count += 1
        return {'deleted': deleted_count, 'added': added_count}
