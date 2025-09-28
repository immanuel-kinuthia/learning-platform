import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    axios.get(`http://localhost:5000/courses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCourse(res.data));
    axios.get(`http://localhost:5000/courses/${id}/reviews`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setReviews(res.data));
  }, [id, token, navigate]);

  const formik = useFormik({
    initialValues: { rating: 1, comment: '' },
    validationSchema: Yup.object({
      rating: Yup.number().min(1, 'Min 1').max(5, 'Max 5').required('Required'),
      comment: Yup.string()
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:5000/reviews', { ...values, course_id: id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        formik.resetForm();
        setError('');
        axios.get(`http://localhost:5000/courses/${id}/reviews`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => setReviews(res.data));
      } catch (error) {
        console.error('Review error:', error);
        setError(error.response?.data?.error || 'Failed to add review. Please try again.');
      }
    }
  });

  if (!course) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Category: {course.category}</p>
      {token && user.role === 'student' && !course.enrolled && (
        <button onClick={async () => {
          try {
            await axios.post('http://localhost:5000/enrollments', { course_id: id }, { headers: { Authorization: `Bearer ${token}` } });
            alert('Enrolled!');
            setCourse({ ...course, enrolled: true });
          } catch (error) {
            alert('Enrollment failed: ' + (error.response?.data?.error || error.message));
          }
        }}>
          Enroll
        </button>
      )}
      <h2>Reviews</h2>
      {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map(r => (
        <div key={r.id}><strong>{r.rating}/5</strong> - {r.comment}</div>
      ))}
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      {token && (
        <form onSubmit={formik.handleSubmit} style={{ marginTop: '1rem' }}>
          <input type="number" name="rating" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.rating} min="1" max="5" />
          {formik.touched.rating && formik.errors.rating ? <div style={{ color: 'red' }}>{formik.errors.rating}</div> : null}
          <textarea name="comment" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.comment} />
          <button type="submit">Add Review</button>
        </form>
      )}
    </div>
  );
};

export default CourseDetails;
