import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      category: Yup.string().required('Required')
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('/courses', values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Course created!');
        navigate('/');
      } catch (error) {
        alert('Creation failed: ' + (error.response?.data?.error || error.message));
      }
    },
  });

  if (!token || user.role !== 'mentor') return <p>Access denied.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Create Course</h2>
      <form onSubmit={formik.handleSubmit}>
        <input name="title" placeholder="Title" {...formik.getFieldProps('title')} />
        {formik.touched.title && formik.errors.title ? <div>{formik.errors.title}</div> : null}
        <textarea name="description" placeholder="Description" {...formik.getFieldProps('description')} />
        {formik.touched.description && formik.errors.description ? <div>{formik.errors.description}</div> : null}
        <input name="category" placeholder="Category" {...formik.getFieldProps('category')} />
        {formik.touched.category && formik.errors.category ? <div>{formik.errors.category}</div> : null}
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateCourse;