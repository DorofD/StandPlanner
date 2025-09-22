from flask import current_app


def check_rocket_bot():
    pass


def get_summary():
    pass


def get_bot_settings():
    target_rooms = [
        {'rid': '68ce03dbf531ef2b877926b6',
         'name': 'sp_test_private_channel', 'type': 'group'},
        {'rid': '6890d0fd169b88fc700cc5fa', 'name': 'sp_test', 'type': 'channel'},
        {'rid': '68cd4b11de482d41e3b557ce', 'name': 'sp_test2', 'type': 'channel'},
        {'rid': '68cd4b4d70869ceac01f61e0', 'name': 'sp_test3', 'type': 'channel'}
    ]
    target_words = []
    if not target_rooms:
        current_app.logger.error(
            f"Rocket.Chat settings is invalid! Some target rooms is missing, complete them and reload bot instance")
        return {'success': False, 'error': "Settings are missing on server or invalid"}
    last_modify = ''
    result = {
        "target_rooms": target_rooms,
        "target_words": target_words,
        "last_modify": last_modify
    }
    return {'success': True, "settings": result}
