from external_interfaces.main_app_api import MainAppAPI


def get_settings():
    """
    структура ответа (data), получаемого от основного приложения:
    {
        "success": bool,
        "settings": {
                        "target_rooms": [{'rid':str, 'name': str, 'stand_uuid'}, ...],
                        "target_strings": {
                            "busy": [str, str, ...],
                            "free": [str, str, ...],
                            "maintenance": [str, str, ...],
                            "lining_up": [str, str, ...]
                        },
                        "reply_on_messages": bool
                    },
        "error": str
    }
    """
    try:
        data = MainAppAPI().get_settings()
    except Exception as e:
        print(f"Unknown exception when get_settings: {e}")
        return {'success': False, 'error': f"Unknown exception when get_settings: {e}"}
    if data['success']:
        try:
            is_valid = validate_settings(data['settings'])
        except Exception as e:
            print(f"Unknown exception when validate_settings: {e}")
            return {'success': False, 'error': f"Unknown exception when validate_settings: {e}"}
        if not is_valid['success']:
            data['success'] = False
            data['error'] = is_valid['error']
            return data
    return data


# """
# Статусы стендов:
# "Free"
# "Busy"
# "Unknown"
# "Maintenance"
# """


def validate_settings(settings: dict) -> dict:
    """
    проверка структуры 'settings':
        "target_rooms": [{'rid':str, 'name': str, 'stand_uuid', str}, ...],
        "target_strings": {
                            "busy": [str, str, ...],
                            "free": [str, str, ...],
                            "maintenance": [str, str, ...],
                            "lining_up": [str, str, ...]
                        },
        "reply_on_messages": bool
    """
    # Проверка наличия ключей верхнего уровня
    required_keys = {"target_rooms", "target_strings", "reply_on_messages"}
    if not required_keys.issubset(settings.keys()):
        missing = required_keys - settings.keys()
        return {'success': False, 'error': f'Fail to validate settings: Missing required keys: {", ".join(missing)}'}

    # Проверяем target_rooms
    target_rooms = settings["target_rooms"]
    if not isinstance(target_rooms, list):
        return {'success': False, 'error': 'Fail to validate settings: "target_rooms" must be a list'}
    for idx, room in enumerate(target_rooms):
        if not isinstance(room, dict):
            return {'success': False, 'error': f'Fail to validate settings: Room at index {idx} is not a dictionary'}
        room_required_keys = {"rid", "name", "stand_uuid"}
        if not room_required_keys.issubset(room.keys()):
            missing = room_required_keys - room.keys()
            return {'success': False, 'error': f'Fail to validate settings: Room at index {idx} is missing keys: {", ".join(missing)}'}
        for key in room_required_keys:
            if not isinstance(room[key], str):
                return {'success': False, 'error': f'Fail to validate settings: Value of "{key}" in room at index {idx} must be a string'}

    # Проверяем target_strings
    target_strings = settings["target_strings"]
    if not isinstance(target_strings, dict):
        return {'success': False, 'error': 'Fail to validate settings: "target_strings" must be a dictionary'}
    required_string_keys = {"busy", "free", "maintenance", "lining_up"}
    if not required_string_keys.issubset(target_strings.keys()):
        missing = required_string_keys - target_strings.keys()
        return {'success': False, 'error': f'Fail to validate settings: "target_strings" is missing keys: {", ".join(missing)}'}
    for key in required_string_keys:
        value = target_strings[key]
        if not isinstance(value, list):
            return {'success': False, 'error': f'Fail to validate settings: "{key}" in "target_strings" must be a list'}
        for i, item in enumerate(value):
            if not isinstance(item, str):
                return {'success': False, 'error': f'Fail to validate settings: Element at index {i} in "{key}" of "target_strings" must be a string'}

    return {'success': True}
