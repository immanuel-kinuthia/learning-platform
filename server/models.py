from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    serialize_rules = ('-courses', '-enrollments')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='student')

    courses = db.relationship('Course', backref='creator', lazy=True)
    enrollments = db.relationship('Enrollment', backref='user', lazy=True)

class Course(db.Model, SerializerMixin):
    serialize_rules = ('-enrollments', '-reviews', '-creator')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    enrollments = db.relationship('Enrollment', backref='course', lazy=True)
    reviews = db.relationship('Review', backref='course', lazy=True)

class Enrollment(db.Model, SerializerMixin):
    serialize_rules = ('-user', '-course')

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    progress = db.Column(db.Integer, default=0)

class Review(db.Model, SerializerMixin):
    serialize_rules = ('-user', '-course')

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(200))