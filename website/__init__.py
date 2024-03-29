from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import URI, config_dict
import os

db = SQLAlchemy()

def createApp():
    app = Flask(__name__)
    
    config_mode = os.getenv('FLASK_ENVIRONMENT', 'Debug')
    app.config.from_object(config_dict[config_mode])

    app.config['SQLALCHEMY_DATABASE_URI'] = URI
    db.init_app(app)

    from .routes import routes

    app.register_blueprint(routes, url_prefix='/')

    from . import models

    createDatabase(app)

    from . import scrapper

    from . import fetcher

    return app

def createDatabase(app):
    with app.app_context():
        db.create_all()