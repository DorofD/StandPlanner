from flask import current_app
from datetime import datetime
from app.repository.queries.rocket_rooms import DBRocketRooms
from app.repository.queries.rocket_bot_settings import DBRocketBotSettings
from app.repository.queries.stands import DBStands
from app.repository.queries.sources_confluence_page_id import DBSourcesConfluencePageId
from app.external_interfaces.rocket_bot_api import RocketBotAPI


def check_bot():
    rbot = RocketBotAPI()
    return rbot.get_check()


def get_bot_status():
    rbot = RocketBotAPI()
    return rbot.get_status()


def get_rocket_rooms():
    rbot = RocketBotAPI()
    rooms = rbot.get_rooms()
    # for i in rooms['rooms']['update']:
    #     print(i)
    return rooms['rooms']['update']


def get_local_rocket_rooms():
    db_rooms = DBRocketRooms()
    rooms = db_rooms.get_rooms()
    return rooms


def get_active_settings_profile():
    # dbr_settings = DBRocketBotSettings()
    # profile = dbr_settings.get_active_profile()
    # print(profile)

    # """    структура ответа (data), получаемого от основного приложения:
    # {
    #     "success": bool,
    #     "settings": {
    #                     "target_rooms": [{'rid':str, 'name': str, 'stand_uuid'}, ...],
    #                     "target_strings": {
    #                         "busy": [str, str, ...],
    #                         "free": [str, str, ...],
    #                         "maintenance": [str, str, ...],
    #                         "in_busy_queue": [str, str, ...],
    #                         "out_of_busy_queue": [str, str, ...]
    #                     },
    #                     "reply_on_messages": bool
    #                 },
    #     "error": str
    # }
    # """
    # if not profile:
    #     return {'success': False, "error": "No active profiles"}
    # return {'success': True, "settings": profile}
    settings = {}
    settings['target_strings'] = {
        "busy": [
            "занял, занято"
        ],
        "free": [
            "освободил",
            "передал",
            "отдал"
        ],
        "maintenance": [
            "обслуживание"
        ],
        "in_busy_queue": [
            "следующий"
        ],
        "out_of_busy_queue": [
            "снялся"
        ],
        "problem": ["!ошибка"]
    }
    settings['target_rooms'] = DBRocketRooms().get_rooms_for_bot()
    return {'success': True, 'settings': settings}


def add_settings_profile(profile_name, target_rooms, target_strings, reply_on_messages):
    DBRocketBotSettings().add_profile(target_rooms, target_strings,
                                      reply_on_messages, profile_name)
    return True


def update_rooms(rocket_rooms):
    if not rocket_rooms:
        return False
    db_rooms = DBRocketRooms()
    local_rooms = db_rooms.get_rooms()
    # Получаем множества id для быстрого поиска
    rocket_ids = set(room['_id'] for room in rocket_rooms)
    local_ids = set(room['rocket_id'] for room in local_rooms)

    to_add = [room for room in rocket_rooms if room['_id'] not in local_ids]
    to_delete = [
        room for room in local_rooms if room['rocket_id'] not in rocket_ids]

    for room in to_add:
        if room['t'] == 'p':
            r_type = 'private'
        elif room['t'] == 'c':
            r_type = 'public'
        else:
            continue

        description = None
        if 'announcement' in room:
            description = room['announcement']

        db_rooms.add_room(rocket_id=room['_id'],
                          rocket_link=None,
                          room_type=r_type,
                          name=room['name'],
                          fname=room['fname'],
                          stand_uuid=None,
                          description=description,
                          status='new',
                          updated_at=None)

    # for room in to_delete:
    #     db_rooms.delete_room_by_rocket_id(room['rocket_id'])
    for room in to_delete:
        db_rooms.update_field(room['id'], 'status', 'outdated')
    return True


def link_data():
    db_rooms = DBRocketRooms()
    db_stands = DBStands()

    rooms = db_rooms.get_rooms()
    stands = db_stands.get_stands_list()

    for room in rooms:
        for stand in stands:
            hit_count = 0
            # совпадение имени
            if stand['name'] == room['name'] or stand['name'] == room['fname']:
                hit_count += 1

            # совпадение Confluence PageID
            if "ConfluencePageId=" in stand['created_by']:
                pageId = stand['created_by'].replace("ConfluencePageId=", '')
                if 'description' in room and room['description'] and pageId in room['description']:
                    hit_count += 1

            # привязка стенда, если совпал хотя бы 1 пункт
            if hit_count > 0:
                now = datetime.now()
                formatted_now = now.strftime("%Y-%m-%d %H:%M:%S")

                db_rooms.update_field(room['id'], 'stand_uuid', stand['uuid'])
                db_rooms.update_field(room['id'], 'status', 'relevant')
                db_rooms.update_field(room['id'], 'updated_at', formatted_now)
        return True


def delete_room(id):
    DBRocketRooms().delete_room(id)
    return True
