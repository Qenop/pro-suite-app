//src\forms\LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // reset error before request

    try {
      // Update URL to match your backend login route
      const res = await axios.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      // Save token and user info securely
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect user after successful login
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else if (user.role === 'caretaker') {
        if (user.propertyId) {
          navigate(`/caretaker/properties/${user.propertyId}/dashboard/water-readings`);

        } else {
          navigate('/'); // fallback
        }
      } else if (user.role === 'landlord') {
        if (user.propertyId){
        navigate(`/landlord/properties/${user.propertyId}/dashboard/expenses`);
      } else {
        navigate('/'); // fallback
      }}
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto bg-white shadow rounded">
      {/* ... your existing form inputs and markup */}
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <div className="mb-3">
        <label htmlFor="email" className="block mb-1">Email:</label>
        <input
          id="email"
          type="email"
          className="w-full border rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="block mb-1">Password:</label>
        <input
          id="password"
          type="password"
          className="w-full border rounded p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-orange-500 transition">
        Login
      </button>
    </form>
  );
};

export default LoginForm;

