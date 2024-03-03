from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin


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


@app.route('/', methods=(['POST', 'GET']))
@cross_origin()
def index():
    try:
        if request.method == 'GET':
            result = jsonify(stands)
        return result
    except:
        return 'zalupa'


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)
