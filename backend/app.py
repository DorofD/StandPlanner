from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from services.user_service import signin, add_user, delete_user, get_users, change_user
from services.stand_service import get_stands, add_stand, delete_stand, change_stand
from errors.intersection_error import IntersectionError

app = Flask(__name__)
cors = CORS(app)
app.config['SECRET_KEY'] = 'dfgjnldfkjgnsladkfjn1488'
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/', methods=(['GET']))
@cross_origin()
def index():
    result = jsonify(get_stands())
    return result


@app.route('/login', methods=(['POST']))
@cross_origin()
def login():
    user = request.json
    auth_result = signin(user['login'], user['password'])
    if auth_result:
        return jsonify({'success': True, 'body': auth_result}), 200, {'ContentType': 'application/json'}
    return jsonify({'success': False}), 401, {'ContentType': 'application/json'}


@app.route('/reservations', methods=(['GET', 'POST']))
@cross_origin()
def reservations():
    pass


@app.route('/stands', methods=(['GET', 'POST']))
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


@app.route('/users', methods=(['GET', 'POST']))
@cross_origin()
def users():
    if request.method == 'GET':
        result = jsonify(get_users())
        return result
    if request.method == 'POST':
        data = request.json
        print(data)
        if data['action'] == 'add':
            add_user(login=data['login'],
                     role=data['role'], auth_type=data['auth_type'])
        if data['action'] == 'change':
            change_user(id=data['id'], role=data['role'])
        if data['action'] == 'delete':
            delete_user(id=data['id'])

    return jsonify({'success': True}), 200, {'ContentType': 'application/json'}


@app.errorhandler(IntersectionError)
def handle_value_error(error):
    """Обработка исключений типа ValueError."""
    return jsonify({'error': str(error.message)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)
