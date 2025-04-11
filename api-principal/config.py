import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'db.main_api_sqlite3')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "J#@DK1571!" 
    JWT_ALGORITHM = 'HS256'
    SALES_CLIENT_ID = os.environ.get('SALES_CLIENT_ID', 'main_api')
    SALES_CLIENT_SECRET = os.environ.get('SALES_CLIENT_SECRET', 'secret_main_api')
    SALES_SERVICE_URL = os.environ.get('SALES_SERVICE_URL', 'http://sales-service:5500/cart/')
    GOOGLE_API_KEY = "AIzaSyBTKUQbsfIc2Yq2WLtytKWZNiE4XNY-jH0"
