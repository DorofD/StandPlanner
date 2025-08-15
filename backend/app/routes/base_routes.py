from flask import Blueprint, request, jsonify
from app.services.stands import get_stands, get_stand, add_stand, delete_stand, change_stand
from app.services.reservations import add_reservaiton, get_reservations_for_planner, change_reservation, delete_reservation
from app.services.sources import add_source, get_sources, process_source, bulk_process_sources, delete_source, change_source
from app import scheduler as app_scheduler
import traceback
import json
main = Blueprint('main', __name__)


@main.route('/reservations', methods=(['GET', 'POST']))
def reservations():
    if request.method == 'GET':
        reservations = get_reservations_for_planner()
        return jsonify(reservations)
    if request.method == 'POST':
        data = request.json
        if data['action'] == 'add':
            add_reservaiton(data['user_id'], data['stand_id'],
                            data['start_time'], data['duration'])
        if data['action'] == 'change':
            change_reservation(data['reservation_id'], data['stand_id'],
                               data['start_time'], data['duration'])
        if data['action'] == 'delete':
            delete_reservation(data['reservation_id'])
    return jsonify({'success': True}), 200, {'ContentType': 'application/json'}


@main.route('/stands', methods=(['GET', 'POST']))
def stands():
    if request.method == 'GET':
        if request.args.get('action') == 'get_list':
            result = jsonify(get_stands())
        elif request.args.get('action') == 'get_stand':
            stand_id = request.args.get('stand_id')
            stand = get_stand(stand_id)
            print(type(stand['page_layout']))
            stand['page_layout'] = json.loads(stand['page_layout'])
            print(len(stand['page_layout']))
            result = jsonify(stand)
        return result
    if request.method == 'POST':
        data = request.json
        if data['action'] == 'add':
            add_stand(name=data['name'], description=data['description'])
        if data['action'] == 'change':
            change_stand(data['id'], data['fields_to_update'])
        if data['action'] == 'delete':
            delete_stand(id=data['id'])

    return jsonify({'success': True}), 200, {'ContentType': 'application/json'}


@main.route('/sources', methods=(['GET', 'POST']))
def sources():
    if request.method == 'GET':
        source_type = request.args.get('source_type')
        result = jsonify(get_sources(source_type))
        return result
    if request.method == 'POST':
        data = request.json
        if data['action'] == 'add':
            result = add_source(data['source_note'])
            if result['success']:
                return jsonify(result), 200, {'ContentType': 'application/json'}
            else:
                return jsonify(result), 400, {'ContentType': 'application/json'}
        if data['action'] == 'process_one':
            if process_source(data['source_type'], data['source_id']):
                return jsonify({'success': True, 'message': 'Source has ben successfully processed'}), 200, {'ContentType': 'application/json'}
            else:
                return jsonify({'success': False, 'message': 'Something going wrong, check source description and service logs'}), 200, {'ContentType': 'application/json'}
        if data['action'] == 'process_all':
            result = bulk_process_sources(data['source_type'])
            return jsonify(result), 200, {'ContentType': 'application/json'}
        if data['action'] == 'change':
            source_type = data['source_type']
            source_note = data['source_note']
            change_source(source_type, source_note)
        if data['action'] == 'delete':
            delete_source(data['id'], data['source_type'])
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
