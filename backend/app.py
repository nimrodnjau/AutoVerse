from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from models import db
import os

if os.path.exists(".env"):
    load_dotenv()

app = Flask(__name__)

database_url = os.getenv('DATABASE_URL', 'sqlite:///autoverse.db')
# Render provides postgres:// but SQLAlchemy needs postgresql://
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret')

db.init_app(app)
jwt = JWTManager(app)
CORS(app, origins=[
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://autoverse-kenya.vercel.app',  # updating this after Vercel deployment
    'https://*.vercel.app',  # allows all Vercel preview URLs
])

from routes.auth import auth_bp
from routes.cars import cars_bp
from routes.orders import orders_bp
from routes.payments import payments_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(cars_bp, url_prefix='/api/cars')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(payments_bp, url_prefix='/api/payments')

@app.route("/")
def home():
    return "🚀 Autoverse API is running"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=False, port=5000)