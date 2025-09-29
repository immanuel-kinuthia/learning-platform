from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-courses', '-enrollments')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='student')

    courses = db.relationship('Course', backref='creator', lazy=True)
    enrollments = db.relationship('Enrollment', backref='user', lazy=True)


class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'
    serialize_rules = ('-enrollments', '-reviews', '-creator')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    enrollments = db.relationship(
        'Enrollment', backref='course', lazy=True, cascade="all, delete-orphan"
    )
    reviews = db.relationship(
        'Review', backref='course', lazy=True, cascade="all, delete-orphan"
    )


class Enrollment(db.Model, SerializerMixin):
    __tablename__ = 'enrollments'
    serialize_rules = ('-user', '-course')

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    progress = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='in-progress')  # optional, for clarity


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    serialize_rules = ('-user', '-course')

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(200))
