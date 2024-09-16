from flask import Flask
from flask_cors import CORS
from app.repository.db_model import create_db
from app.repository.queries.users import add_user_db, get_users_db
from app.models.scheduler import Scheduler

scheduler = None


def create_app():
    global scheduler
    scheduler = Scheduler()

    app = Flask(__name__)
    CORS(app)
    app.config['SECRET_KEY'] = 'dfgjnldfkjgnsladkfjn1488'
    app.config['CORS_HEADERS'] = 'Content-Type'
    from app.routes import main as main_blueprint
    app.register_blueprint(main_blueprint)
    create_db()
    for user in get_users_db():
        if user['login'] == 'admin':
            break
        add_user_db('admin', 'local', 'admin', 'admin')

    return app
