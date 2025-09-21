from flask import Blueprint, request, jsonify
from app.services.rocket import get_summary, check_rocket_bot
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
