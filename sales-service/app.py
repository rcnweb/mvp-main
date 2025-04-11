# sales_api/app.py
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_restx import Api
from flask_cors import CORS  
from werkzeug.middleware.proxy_fix import ProxyFix
from config import Config
from models import db
from routes import cart_namespace


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.wsgi_app = ProxyFix(app.wsgi_app)
    app.config.from_object(Config)
    api = Api(
    app, 
    version='1.0', 
    title='Micro serviço de vendas', 
    description='Um Micro serviço de vendas', 
    doc='/swagger',
    security='Bearer Auth', 
    authorizations={
        'Bearer Auth': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization',
            'description': 'Adicione o token JWT no formato: Bearer <token>'
        }
    }
    )

    db.init_app(app)

    jwt = JWTManager(app)

    api.add_namespace(cart_namespace, path='/cart')
    
    with app.app_context():
        db.create_all()
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, threaded=True, port=5500)