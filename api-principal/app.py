from flask import Flask
from flask_jwt_extended import JWTManager
from flask_restx import Api
from flask_cors import CORS  
from werkzeug.middleware.proxy_fix import ProxyFix
from config import Config
from models import db, bcrypt, User
from routes import usuario_namespace, livros_namespace, cart_namespace

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})
    app.wsgi_app = ProxyFix(app.wsgi_app)
    app.config.from_object(Config)
    api = Api(
    app, 
    version='1.0', 
    title='API de Venda de Livros', 
    description='Uma API para vender livros', 
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
    bcrypt.init_app(app)
    jwt = JWTManager(app)

    api.add_namespace(usuario_namespace)
    api.add_namespace(cart_namespace) 
    api.add_namespace(livros_namespace)  

    with app.app_context():
        db.create_all()
        if not User.query.filter_by(email="admin@admin.com").first():
            admin = User(nome="Admin", email="admin@admin.com", senha="admin123", role="ADMIN")
            db.session.add(admin)
            db.session.commit()
        else:
            print("Admin já existe no banco de dados!")
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, threaded=True, port=5000)
