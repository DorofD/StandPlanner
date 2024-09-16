from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from app.services.user_service import signin, add_user, delete_user, get_users, change_user
from app.services.stand_service import get_stands, add_stand, delete_stand, change_stand
import app.services.reservation_service as reservation_service
from app.errors.reservation_errors import IntersectionError, ReservationError

import traceback

main = Blueprint('main', __name__)


@main.route('/login', methods=(['POST']))
@cross_origin()
def login():
    user = request.json
    auth_result = signin(user['login'], user['password'])
    if auth_result:
        return jsonify({'success': True, 'body': auth_result}), 200, {'ContentType': 'application/json'}
    return jsonify({'success': False}), 401, {'ContentType': 'application/json'}


@main.route('/reservations', methods=(['GET', 'POST']))
@cross_origin()
def reservations():
    if request.method == 'GET':
        reservations = reservation_service.get_reservations_for_planner()
        return jsonify(reservations)
    if request.method == 'POST':
        data = request.json
        if data['action'] == 'add':
            reservation_service.add_reservaiton(data['user_id'], data['stand_id'],
                                                data['start_time'], data['duration'])
        if data['action'] == 'change':
            reservation_service.change_reservation(data['reservation_id'], data['stand_id'],
                                                   data['start_time'], data['duration'])
        if data['action'] == 'delete':
            reservation_service.delete_reservation(data['reservation_id'])
    return jsonify({'success': True}), 200, {'ContentType': 'application/json'}


@main.route('/stands', methods=(['GET', 'POST']))
@cross_origin()
def stands():
    if request.method == 'GET':
        result = jsonify(get_stands())
        return result
    if request.method == 'POST':
        data = request.json
        if data['action'] == 'add':
            add_stand(name=data['name'], description=data['description'])
        if data['action'] == 'change':
            change_stand(id=data['id'], name=data['name'],
                         description=data['description'])
        if data['action'] == 'delete':
            delete_stand(id=data['id'])

    return jsonify({'success': True}), 200, {'ContentType': 'application/json'}


@main.route('/comments', methods=(['GET']))
@cross_origin()
def index():
    result = jsonify(get_stands())
    return result


@main.route('/users', methods=(['GET', 'POST']))
@cross_origin()
def users():
    if request.method == 'GET':
        result = jsonify(get_users())
        return result
    if request.method == 'POST':
        data = request.json
        if data['action'] == 'add':
            add_user(login=data['login'],
                     role=data['role'], auth_type=data['auth_type'])
        if data['action'] == 'change':
            change_user(id=data['id'], role=data['role'])
        if data['action'] == 'delete':
            delete_user(id=data['id'])

    return jsonify({'success': True}), 200, {'ContentType': 'application/json'}


@main.errorhandler(IntersectionError)
def handle_value_error(error):
    return jsonify({'error': str(error)}), 400


@main.errorhandler(ReservationError)
def handle_value_error(error):
    return jsonify({'error': str(error)}), 400


@main.errorhandler(Exception)
def handle_value_error(error):
    print(f"ERROR: {error}")
    traceback.print_exc()
    return jsonify({'error': f'Непонятная ошибка на беке: {error}'}), 500


if __name__ == '__main__':

    app.run(host='0.0.0.0', debug=False)
