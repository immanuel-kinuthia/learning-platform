from app import app, db
from models import User, Course, Enrollment, Review
from werkzeug.security import generate_password_hash

with app.app_context():
    db.drop_all()
    db.create_all()

