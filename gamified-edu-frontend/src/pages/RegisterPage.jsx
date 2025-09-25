import React, { useState } from 'react';
import { registerUser } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background-color: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: 8px;
`;
const FormGroup = styled.div` margin-bottom: 1.5rem; `;
const Label = styled.label` display: block; margin-bottom: 0.5rem; color: var(--text-secondary);`;


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <RegisterContainer>
      <h2>Register</h2>
       {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="first_name">First Name</Label>
          <input type="text" id="first_name" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="last_name">Last Name</Label>
          <input type="text" id="last_name" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <input type="email" id="email" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <input type="password" id="password" onChange={handleChange} required />
        </FormGroup>
        <button type="submit">Register</button>
      </form>
       <p style={{marginTop: '1rem'}}>
         Already have an account? <Link to="/login" style={{color: 'var(--accent-blue)'}}>Login here</Link>
       </p>
    </RegisterContainer>
  );
};

export default RegisterPage;