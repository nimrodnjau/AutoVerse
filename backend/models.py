from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    phone = db.Column(db.String(20))
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    orders = db.relationship('Order', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat()
        }


class Car(db.Model):
    __tablename__ = 'cars'
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    mileage = db.Column(db.String(50))
    fuel_type = db.Column(db.String(50))
    engine = db.Column(db.String(100))
    power = db.Column(db.String(50))
    color = db.Column(db.String(100))
    description = db.Column(db.Text)
    badge = db.Column(db.String(20))
    emoji = db.Column(db.String(10))
    in_stock = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'brand': self.brand,
            'name': self.name,
            'year': self.year,
            'price': self.price,
            'category': self.category,
            'mileage': self.mileage,
            'fuel_type': self.fuel_type,
            'engine': self.engine,
            'power': self.power,
            'color': self.color,
            'description': self.description,
            'badge': self.badge,
            'emoji': self.emoji,
            'in_stock': self.in_stock
        }


class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    reference = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), default='pending')
    delivery_address = db.Column(db.String(300))
    phone = db.Column(db.String(20))
    payment_method = db.Column(db.String(30))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship('OrderItem', backref='order', lazy=True)
    payment = db.relationship('Payment', backref='order', uselist=False)

    def to_dict(self):
        return {
            'id': self.id,
            'reference': self.reference,
            'user_id': self.user_id,
            'total_amount': self.total_amount,
            'status': self.status,
            'delivery_address': self.delivery_address,
            'phone': self.phone,
            'payment_method': self.payment_method,
            'created_at': self.created_at.isoformat(),
            'items': [i.to_dict() for i in self.items]
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey('cars.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price_at_purchase = db.Column(db.Float, nullable=False)
    car = db.relationship('Car')

    def to_dict(self):
        return {
            'id': self.id,
            'car_id': self.car_id,
            'car': self.car.to_dict() if self.car else None,
            'quantity': self.quantity,
            'price_at_purchase': self.price_at_purchase
        }


class Payment(db.Model):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    merchant_request_id = db.Column(db.String(100))
    checkout_request_id = db.Column(db.String(100))
    mpesa_receipt = db.Column(db.String(100))
    amount = db.Column(db.Float)
    phone = db.Column(db.String(20))
    status = db.Column(db.String(30), default='pending')
    result_desc = db.Column(db.String(300))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'mpesa_receipt': self.mpesa_receipt,
            'amount': self.amount,
            'phone': self.phone,
            'status': self.status,
            'result_desc': self.result_desc,
            'created_at': self.created_at.isoformat()
        }