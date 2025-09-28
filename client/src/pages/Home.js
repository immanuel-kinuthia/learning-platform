import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId) => {
    if (!token) {
      alert('Please login to enroll');
      return;
    }
    try {
      await axios.post('http://localhost:5000/enrollments', { course_id: courseId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Enrolled!');
      fetchCourses();
    } catch (error) {
      alert('Enrollment failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const deleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`http://localhost:5000/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Course deleted!');
      fetchCourses();
    } catch (error) {
      alert('Delete failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const editCourse = (course) => {
    const newTitle = prompt('New title:', course.title);
    const newDescription = prompt('New description:', course.description);
    const newCategory = prompt('New category:', course.category);
    if (newTitle && newDescription && newCategory) {
      axios.put(`http://localhost:5000/courses/${course.id}`, {
        title: newTitle,
        description: newDescription,
        category: newCategory
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        alert('Course updated!');
        fetchCourses();
      }).catch(error => {
        alert('Update failed: ' + (error.response?.data?.error || error.message));
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Courses</h1>
      {courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course.id} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <strong>{course.title}</strong> - {course.description} ({course.category})
              </div>
              <Link to={`/courses/${course.id}`} style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>View</Link>
              {token && user.role === 'student' && (
                <button onClick={() => enrollInCourse(course.id)} style={{ marginRight: '5px' }}>Enroll</button>
              )}
              {token && user.role === 'mentor' && Number(course.user_id) === Number(user.id) && (
                <>
                  <button onClick={() => editCourse(course)} style={{ marginRight: '5px' }}>Edit</button>
                  <button onClick={() => deleteCourse(course.id)} style={{ marginRight: '5px', background: 'red', color: 'white' }}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;