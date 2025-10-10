from app.repository.queries.stands import DBStands
from app.redis_repository.stands import RedisStands
import uuid
import sqlite3


def get_stands():
    stands_list = DBStands().get_stands_list()
    r_stands_list = RedisStands().get_all_stands()
    for stand in stands_list:
        try:
            stand['status'] = r_stands_list[stand['uuid']]['status']
        except KeyError:
            stand['status'] = "Unknown"
    return stands_list


def get_stand(id):
    stand = DBStands().get_stand(id)
    if not stand:
        return stand
    r_stand = RedisStands(
    ).get_stand(stand['name'])
    if r_stand:
        status = r_stand['status']
    else:
        status = 'Unknown'
    stand['status'] = status
    return stand


def add_stand(name: str, description: str, current_user):
    stand_uuid = str(uuid.uuid4())
    try:
        DBStands().add_stand(stand_uuid, name=name, source_type='manual',
                             description=description, created_by=current_user)
    except sqlite3.IntegrityError as e:
        if "UNIQUE constraint failed: stands.uuid" in str(e):
            stand_uuid = str(uuid.uuid4())
            DBStands().add_stand(stand_uuid, name=name, source_type='manual',
                                 description=description, created_by=current_user)
        else:
            raise
    RedisStands().set_stand(stand_uuid)


def delete_stand(id: int):
    DBStands().delete_stand(id=id)


def change_stand(id: int, updated_fields: list):
    if 'name' in updated_fields:
        DBStands().update_stand_field(id, 'name', updated_fields['name'])
    if 'description' in updated_fields:
        DBStands().update_stand_field(
            id, 'description', updated_fields['description'])
