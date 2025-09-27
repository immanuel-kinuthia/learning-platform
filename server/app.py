from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Course, Enrollment, Review
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
CORS(app)
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to SkillShare'}), 200

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    hashed_password = generate_password_hash(data['password'])
    new_user = User(name=data['name'], email=data['email'], password=hashed_password, role=data.get('role', 'student'))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'token': access_token,
            'user_id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([{'id': c.id, 'title': c.title, 'description': c.description, 'category': c.category, 'user_id': c.user_id} for c in courses]), 200


@app.route('/courses', methods=['POST'])
@jwt_required()
def create_course():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    new_course = Course(title=data['title'], description=data['description'], category=data['category'], user_id=current_user_id)
    db.session.add(new_course)
    db.session.commit()
    return jsonify({'message': 'Course created', 'id': new_course.id}), 201

@app.route('/courses/<int:id>', methods=['PUT'])
@jwt_required()
def update_course(id):
    current_user_id = int(get_jwt_identity())
    course = Course.query.get_or_404(id)
    if course.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.get_json()
    course.title = data.get('title', course.title)
    course.description = data.get('description', course.description)
    course.category = data.get('category', course.category)
    db.session.commit()
    return jsonify({'id': course.id, 'title': course.title, 'description': course.description, 'category': course.category}), 200

@app.route('/courses/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_course(id):
    current_user_id = int(get_jwt_identity())
    course = Course.query.get_or_404(id)
    if course.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(course)
    db.session.commit()
    return jsonify({'message': 'Course deleted'}), 200

@app.route('/enrollments', methods=['POST'])
@jwt_required()
def enroll():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    print(f"Data received: {data}")
    if not data or 'course_id' not in data:
        return jsonify({'error': 'Invalid data'}), 400
    course_id = data['course_id']
    print(f"Course ID: {course_id}, type: {type(course_id)}")
    if not isinstance(course_id, int):
        try:
            course_id = int(course_id)
        except ValueError:
            return jsonify({'error': 'course_id must be integer'}), 400
    if Enrollment.query.filter_by(user_id=current_user_id, course_id=course_id).first():
        return jsonify({'error': 'Already enrolled'}), 400
    new_enrollment = Enrollment(user_id=current_user_id, course_id=course_id)
    db.session.add(new_enrollment)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to enroll', 'details': str(e)}), 500
    return jsonify({'message': 'Enrolled'}), 201