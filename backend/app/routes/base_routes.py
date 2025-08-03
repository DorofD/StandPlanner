from flask import Blueprint, request, jsonify
from app.services.api_services.stands import get_stands, get_stand, add_stand, delete_stand, change_stand
import app.services.reservation_service as reservation_service
from app import scheduler as app_scheduler

import traceback

main = Blueprint('main', __name__)


@main.route('/reservations', methods=(['GET', 'POST']))
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
def stands():
    if request.method == 'GET':
        if request.args.get('action') == 'get_list':
            result = jsonify(get_stands())
        elif request.args.get('action') == 'get_stand':
            stand_id = request.args.get('stand_id')
            result = jsonify(get_stand(stand_id))
        return result
    if request.method == 'POST':
        data = request.json
        if data['action'] == 'add':
            add_stand(name=data['name'], description=data['description'])
        if data['action'] == 'change':
            if 'name' in data:
                change_stand(id=data['id'], name=data['name'])
            if 'description' in data:
                change_stand(id=data['id'], description=data['description'])
        if data['action'] == 'delete':
            delete_stand(id=data['id'])

    return jsonify({'success': True}), 200, {'ContentType': 'application/json'}


@main.route('/comments', methods=(['GET']))
def index():
    result = jsonify(get_stands())
    return result


@main.route('/scheduler', methods=(['GET']))
def scheduler():
    if request.method == 'GET':
        result = jsonify(app_scheduler.get_info())
        return result
