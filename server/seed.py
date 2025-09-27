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

course1 = Course(title="Intro to Python", description="Learn Python basics", category="Programming", user_id=mentor.id)
course2 = Course(title="Web Development", description="Build websites", category="Web", user_id=mentor.id)
db.session.add(course1)
db.session.add(course2)
db.session.commit()

enrollment = Enrollment(user_id=student.id, course_id=course1.id, progress=50)
db.session.add(enrollment)
db.session.commit()