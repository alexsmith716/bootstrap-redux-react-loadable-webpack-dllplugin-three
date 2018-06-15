import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';
import PropTypes from 'prop-types';
import loginValidation from './loginValidation';

//const styles = require('./scss/LoginForm.scss');

const Input = ({
  input, label, type, meta: { touched, error, submitError }, ...rest
}) => (

  <div>

    {label === 'Email' && (

      <label htmlFor={input.name}>{label}</label>
    )}

    {label === 'Password' && (

      <div>

        <label htmlFor={input.name}>
          {label}
        </label>

        <div>
          <a href="/password_reset">Forgot password?</a>
        </div>

      </div>
    )}

    <div>

      <input {...input} {...rest} type={type} />

      {(error || submitError) && touched && <span />}

      {(error || submitError) &&
        touched && (
        <div>
          <strong>{error || submitError}</strong>
        </div>
      )}
    </div>
  </div>

);

Input.propTypes = {
  input: PropTypes.objectOf(PropTypes.any).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(PropTypes.any).isRequired
};

const LoginForm = ({ onSubmit }) => (

  <Form

    onSubmit={values => onSubmit(values).then(() => {}, err => err)}
    validate={loginValidation}

    render={({ handleSubmit, submitError }) => (

      <form onSubmit={handleSubmit}>

        <div>
          <Field name="email" type="text" component={Input} label="Email" />
        </div>

        <div>
          <Field name="password" type="password" component={Input} label="Password" />
        </div>

        {submitError && (
          <p>
            <strong>{submitError}</strong>
          </p>
        )}

        <div>
          <a href="index.html">Sign in</a>
        </div>

      </form>
    )}
  />
);


LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default LoginForm;
