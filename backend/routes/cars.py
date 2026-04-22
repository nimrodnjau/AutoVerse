from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Car, User

cars_bp = Blueprint('cars', __name__)


def admin_required(fn):
    """Decorator that checks if the current user is an admin."""
    from functools import wraps
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    return wrapper


@cars_bp.route('/', methods=['GET'])
def get_cars():
    category = request.args.get('category')
    search = request.args.get('search', '').lower()
    query = Car.query.filter_by(in_stock=True)
    if category and category != 'all':
        query = query.filter_by(category=category)
    cars = query.all()
    if search:
        cars = [c for c in cars if search in c.name.lower() or search in c.brand.lower()]
    return jsonify({'cars': [c.to_dict() for c in cars]}), 200


@cars_bp.route('/<int:car_id>', methods=['GET'])
def get_car(car_id):
    car = Car.query.get_or_404(car_id)
    return jsonify({'car': car.to_dict()}), 200


@cars_bp.route('/featured', methods=['GET'])
def get_featured():
    cars = Car.query.filter_by(in_stock=True).limit(4).all()
    return jsonify({'cars': [c.to_dict() for c in cars]}), 200


@cars_bp.route('/', methods=['POST'])
@admin_required
def add_car():
    data = request.get_json()
    required = ['brand', 'name', 'year', 'price', 'category']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    car = Car(
        brand=data['brand'],
        name=data['name'],
        year=int(data['year']),
        price=float(data['price']),
        category=data['category'],
        mileage=data.get('mileage', '0'),
        fuel_type=data.get('fuel_type', 'Petrol'),
        engine=data.get('engine', ''),
        power=data.get('power', ''),
        color=data.get('color', ''),
        description=data.get('description', ''),
        badge=data.get('badge'),
        emoji=data.get('emoji', '🚗'),
        in_stock=True
    )
    db.session.add(car)
    db.session.commit()
    return jsonify({'car': car.to_dict()}), 201


@cars_bp.route('/<int:car_id>', methods=['PUT'])
@admin_required
def update_car(car_id):
    car = Car.query.get_or_404(car_id)
    data = request.get_json()

    car.brand = data.get('brand', car.brand)
    car.name = data.get('name', car.name)
    car.year = int(data.get('year', car.year))
    car.price = float(data.get('price', car.price))
    car.category = data.get('category', car.category)
    car.mileage = data.get('mileage', car.mileage)
    car.fuel_type = data.get('fuel_type', car.fuel_type)
    car.engine = data.get('engine', car.engine)
    car.power = data.get('power', car.power)
    car.color = data.get('color', car.color)
    car.description = data.get('description', car.description)
    car.badge = data.get('badge', car.badge)
    car.emoji = data.get('emoji', car.emoji)
    car.in_stock = data.get('in_stock', car.in_stock)

    db.session.commit()
    return jsonify({'car': car.to_dict()}), 200


@cars_bp.route('/<int:car_id>', methods=['DELETE'])
@admin_required
def delete_car(car_id):
    car = Car.query.get_or_404(car_id)
    db.session.delete(car)
    db.session.commit()
    return jsonify({'message': 'Car deleted successfully'}), 200