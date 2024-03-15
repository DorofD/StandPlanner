from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from backend.services.user_service import signin, add_user, delete_user
from backend.repository.queries.users import get_users_db

app = Flask(__name__)
cors = CORS(app)
app.config['SECRET_KEY'] = 'dfgjnldfkjgnsladkfjn1488'
app.config['CORS_HEADERS'] = 'Content-Type'


stands = [
    {
        'id': 1,
        'name': 'stand 1',
        'state': 'busy',
        'os': 'ubuntu 18'
    },
    {
        'id': 2,
        'name': 'stand 2',
        'state': 'busy',
        'os': 'ubuntu 18'
    },
    {
        'id': 3,
        'name': 'stand 3',
        'state': 'free',
        'os': 'ubuntu 18'
    },
]


@app.route('/', methods=(['GET']))
@cross_origin()
def index():
    result = jsonify(stands)
    return result


@app.route('/login', methods=(['POST']))
@cross_origin()
def login():
    user = request.json
    auth_result = signin(user['login'], user['password'])
    if auth_result:
        return jsonify({'success': True, 'body': auth_result}), 200, {'ContentType': 'application/json'}
    return jsonify({'success': False}), 401, {'ContentType': 'application/json'}


@app.route('/users', methods=(['GET', 'POST']))
@cross_origin()
def users():
    if request.method == 'GET':
        result = jsonify(get_users_db())
        return result
    if request.method == 'POST':
        data = request.json
        print(data)
        if data['action'] == 'add':
            add_user(login=data['login'],
                     role=data['role'], auth_type=data['auth_type'])
        if data['action'] == 'delete':
            delete_user(id=data['id'])

    return jsonify({'success': True, 'body': 'sas'}), 200, {'ContentType': 'application/json'}


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)
