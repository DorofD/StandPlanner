from flask import Flask, jsonify, current_app
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended.exceptions import NoAuthorizationError
import os
import logging
import traceback
from datetime import timedelta
from dotenv import load_dotenv
import traceback


from app.domain.scheduler import Scheduler
from app.repository.db_model import create_db
from app.repository.queries.stands import DBStands
from app.redis_repository.stands import RedisStands
from app.services.users import add_user, get_users
from app.errors.reservation_errors import IntersectionError, ReservationError
scheduler = None


def create_app():
    global scheduler
    scheduler = Scheduler()

    load_dotenv('.env')
    app = Flask(__name__)
    CORS(app,
         supports_credentials=True)
    app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config['JWT_SECRET_KEY'] = os.environ['JWT_SECRET_KEY']
    app.config["JWT_TOKEN_LOCATION"] = ['headers', 'cookies']
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = ""
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(minutes=180)
    app.config['JWT_REFRESH_COOKIE_PATH'] = '/'
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    app.config['JWT_REFRESH_COOKIE_NAME'] = 'refresh_token'

    jwt = JWTManager()
    jwt.init_app(app)

    @app.errorhandler(NoAuthorizationError)
    def handle_no_authorization_error(e):
        return jsonify({"msg": "Missing Authorization Header"}), 401

    @app.errorhandler(IntersectionError)
    def handle_value_error(error):
        return jsonify({'message': str(error)}), 400

    @app.errorhandler(ReservationError)
    def handle_value_error(error):
        return jsonify({'message': str(error)}), 400

    @app.errorhandler(Exception)
    def handle_value_error(error):
        print(f"ERROR: {error}")
        traceback.print_exc()
        current_app.logger.error(
            f"Unknown error: {str(error)} | {traceback.format_exc()}")
        return jsonify({'message': f'Backend error: {error}'}), 500

    handler = logging.FileHandler('data/app.log')
    formatter = logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)

    app.logger.handlers = []
    app.logger.addHandler(handler)

    log_level = os.environ['LOG_LEVEL'].lower()
    if log_level == 'info':
        app.logger.setLevel(logging.INFO)
    elif log_level == 'debug':
        app.logger.setLevel(logging.DEBUG)
    else:
        app.logger.setLevel(logging.INFO)

    from app.routes.base_routes import main as main_blueprint
    from app.routes.login import login_bp
    from app.routes.users import users_bp
    from app.routes.logs import logs_bp

    app.register_blueprint(main_blueprint)
    app.register_blueprint(login_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(logs_bp)

    create_db()
    users = get_users()
    if not users:
        add_user('admin', 'local', 'admin', 'admin')

    db_uuids_dict = DBStands().get_uuids_to_names_dict()
    redis_stands = RedisStands().get_all_stands()
    for stand in redis_stands:
        if stand['stand_uuid'] not in db_uuids_dict:
            RedisStands().delete_stand(stand['stand_uuid'])
    for stand_uuid in db_uuids_dict:
        RedisStands().set_stand(stand_uuid, db_uuids_dict[stand_uuid])

    return app
