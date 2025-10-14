import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { updatePasswordValidationSchema } from '../utils/validationSchemas';
import { authAPI } from '../utils/api';
import './Auth.css';

const UpdatePassword = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: updatePasswordValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        const { confirmPassword, ...passwordData } = values;
        await authAPI.updatePassword(passwordData);
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.message || 'Password update failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Success!</h2>
          <p className="success-message">Password updated successfully. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Update Password</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currentPassword}
              className={formik.touched.currentPassword && formik.errors.currentPassword ? 'error' : ''}
            />
            {formik.touched.currentPassword && formik.errors.currentPassword && (
              <div className="field-error">{formik.errors.currentPassword}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password (8-16 chars, uppercase & special char)</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              className={formik.touched.newPassword && formik.errors.newPassword ? 'error' : ''}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className="field-error">{formik.errors.newPassword}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="field-error">{formik.errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
