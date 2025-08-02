from flask import Blueprint, request, jsonify
# from flask_cors import cross_origin
from app.services.stand_service import get_stands, add_stand, delete_stand, change_stand
import app.services.reservation_service as reservation_service
from app import scheduler as app_scheduler

import traceback

main = Blueprint('main', __name__)


@main.route('/reservations', methods=(['GET', 'POST']))
# @cross_origin()
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
# @cross_origin()
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
# @cross_origin()
def index():
    result = jsonify(get_stands())
    return result


@main.route('/scheduler', methods=(['GET']))
# @cross_origin()
def scheduler():
    if request.method == 'GET':
        result = jsonify(app_scheduler.get_info())
        return result
