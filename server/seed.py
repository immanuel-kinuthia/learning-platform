from app import app, db
from models import User, Course, Enrollment, Review
from werkzeug.security import generate_password_hash

with app.app_context():
    db.drop_all()
    db.create_all()

mentor = User(name="Mentor One", email="mentor@example.com", password=generate_password_hash("password"), role="mentor")
student = User(name="Student One", email="student@example.com", password=generate_password_hash("password"), role="student")
db.session.add(mentor)
db.session.add(student)
db.session.commit()

