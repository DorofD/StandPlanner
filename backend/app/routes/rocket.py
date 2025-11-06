from flask import Blueprint, request, jsonify, current_app
from app.services.rocket import check_bot, get_bot_status, get_active_settings_profile, get_rocket_rooms, get_local_rocket_rooms, update_rooms, delete_room, link_data, add_settings_profile
from flask_jwt_extended import jwt_required
from app.routes import role_required

rocket_bp = Blueprint('rocket', __name__)


# эндпоинт для UI
@rocket_bp.route('/rocket', methods=(['GET', 'POST']))
@jwt_required()
@role_required('admin')
def rocket():
    if request.method == 'GET':
        if 'action' not in request.args.keys():
            print(check_bot())
            result = jsonify(check_bot())
            return result
        if request.args.get('action') == 'get_bot_status':
            print(get_bot_status())
            result = jsonify(get_bot_status())
            return result
        if request.args.get('action') == 'get_rocket_rooms':
            # print(get_rocket_rooms())
            result = jsonify(get_rocket_rooms())
            return result
        if request.args.get('action') == 'get_local_rocket_rooms':
            # print(get_rocket_rooms())
            result = jsonify(get_local_rocket_rooms())
            return result

    if request.method == 'POST':
        data = request.json
        if data['action'] == 'update':
            update_rooms(data['rooms'])
        if data['action'] == 'link_data':
            link_data()
        if data['action'] == 'delete':
            delete_room(data['id'])
        if data['action'] == 'add_settings':
            add_settings_profile(data['settings'])

    return jsonify({'success': True}), 200, {'ContentType': 'application/json'}


# сервисный эндпоинт для инстанса бота
@rocket_bp.route('/rocket_bot', methods=(['GET', 'POST']))
def rocket_bot():
    if request.method == 'GET':
        if request.args.get('action') == 'get_settings':
            return jsonify(get_active_settings_profile())

    return jsonify({'success': True}), 200, {'ContentType': 'application/json'}
