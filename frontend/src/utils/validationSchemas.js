import * as Yup from 'yup';

export const signupValidationSchema = Yup.object({
  name: Yup.string()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must not exceed 60 characters')
    .matches(/^[a-zA-Z0-9\s]+$/, 'Name must be alphanumeric')
    .required('Name is required'),
  email: Yup.string()
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Invalid email format'
    )
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  address: Yup.string()
    .max(400, 'Address must not exceed 400 characters')
    .required('Address is required'),
  role: Yup.string()
    .oneOf(['admin', 'user', 'owner'], 'Invalid role')
    .required('Role is required'),
});

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Invalid email format'
    )
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

export const updatePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const storeValidationSchema = Yup.object({
  name: Yup.string()
    .min(20, 'Store name must be at least 20 characters')
    .max(60, 'Store name must not exceed 60 characters')
    .matches(/^[a-zA-Z0-9\s]+$/, 'Store name must be alphanumeric')
    .required('Store name is required'),
  email: Yup.string()
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Invalid email format'
    )
    .required('Email is required'),
  address: Yup.string()
    .max(400, 'Address must not exceed 400 characters')
    .required('Address is required'),
});
