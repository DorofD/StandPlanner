from flask import Blueprint, request, jsonify, current_app
from app.services.rocket import get_summary, check_rocket_bot, get_bot_settings
from flask_jwt_extended import jwt_required
from app.routes import role_required

rocket_bp = Blueprint('rocket', __name__)


@rocket_bp.route('/rocket', methods=(['GET', 'POST']))
@jwt_required()
@role_required('admin')
def rocket():
    if request.method == 'GET':
        result = jsonify(get_summary())
        return result

    if request.method == 'POST':
        data = request.json
        if data['action'] == 'check_bot':
            check_rocket_bot()

    return jsonify({'success': True}), 200, {'ContentType': 'application/json'}


# сервисный эндпоинт для инстанса бота
@rocket_bp.route('/rocket_bot', methods=(['GET', 'POST']))
def rocket_bot():
    if request.method == 'GET':
        if request.args.get('action') == 'get_settings':
            return jsonify(get_bot_settings())

    if request.method == 'POST':
        data = request.json
        if data['action'] == 'check_bot':
            pass

    return jsonify({'success': True}), 200, {'ContentType': 'application/json'}
