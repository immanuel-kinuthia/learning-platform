import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchEnrollments = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/my-enrollments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchEnrollments();
    } else {
      setLoading(false);
    }
  }, [token, fetchEnrollments]);

  const updateProgress = async (id, progress) => {
    try {
      await axios.put(`http://localhost:5000/enrollments/${id}`, { progress }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEnrollments();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!token) return <p>Please login.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {user.role === 'student' && (
        <div>
          <h2>Enrollments</h2>
          {enrollments.length === 0 ? (
            <p>No enrollments.</p>
          ) : (
            <ul>
              {enrollments.map(e => (
                <li key={e.id} style={{ marginBottom: '1rem' }}>
                  <strong>{e.course.title}</strong> - Status: {e.progress === 100 ? 'Complete' : 'Incomplete'}
                  {e.progress < 100 ? (
                    <button onClick={() => updateProgress(e.id, 100)}>Mark as Complete</button>
                  ) : (
                    <div style={{ color: 'green', fontWeight: 'bold' }}>Course Completed</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
