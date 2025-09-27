# SkillShare

### Overview

This is a full-stack web application built with a Flask API backend and a React frontend. It allows mentors to create courses and students to enroll in them, track their progress, and complete their learning journey. The app includes user authentication, course management, enrollment tracking, and extra features like reviews, ratings, certificates, and dark mode.
The project follows best practices for full-stack development:

**MVP Focus:** Prioritized core user stories before adding stretch features.
**Vertical Slices:** Built features end-to-end (e.g., authentication first, then course creation, enrollment, etc.).
**Planning First:** User stories, models/relationships (ERD), and wireframes were designed before coding.

This app demonstrates:

Flask with SQLAlchemy for backend models and API routes.
React with React Router, Formik/Yup for forms/validation, and Axios for API calls.
JWT for authentication.
At least three models with required relationships (two one-to-many, one reciprocal many-to-many with user-submittable attribute like progress).
Full CRUD on Courses; create/read on others.
Client-side routing (Home, Profile, Course Details).
Validations: Data types (e.g., integer for progress), formats (e.g., email, min length for strings).

## Models and Relationships

<img width="1358" height="550" alt="React Flask" src="https://github.com/user-attachments/assets/1ed784da-2aa2-4325-8ca5-eb75e64294ff" />


### Relationships:

**One-to-Many:** User → Courses (via created_by), Course → Enrollments, User → Enrollments.
**Reciprocal Many-to-Many:** Users ↔ Courses via Enrollment (with progress as submittable attribute).
**Additional:** Course → Reviews, User → Reviews.

## Setup and Installation

### Prerequisites

Python 3.8+
Node.js 14+ and npm
Git (optional)

### Steps

Clone the repo (if applicable) or create the directory structure as above.

###Backend Setup:

`cd server`
`pip install -r requirements.txt`
Create .env with SECRET_KEY=your_secret and DATABASE_URI=sqlite:///app.db
`flask db init`
`flask db migrate -m "Initial migration"`
`flask db upgrade`
`Optional: python seed.py for test data.`


### Frontend Setup:

`cd client`
`npm install`


### Run the app:

Backend: `cd server` && `flask run` (runs on http://localhost:5000)
Frontend: `cd client` && `npm start` (runs on http://localhost:3000)



## Usage

Open http://localhost:3000.
Register/login as mentor or student.
Mentors: Create/edit courses on Home.
Students: Enroll via Home, track progress on Profile/Course Details.
Extras: Submit reviews on Course Details, download certificates on completion, toggle dark mode in NavBar.

## Testing

Use Postman for API routes (e.g., POST /register, GET /courses).
Browser console for frontend errors.
Seed data includes sample users/courses.
