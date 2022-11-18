import axios from 'axios';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RegisterUserView = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();

  const API_URL = '/api/user/register';
  const registerHeader = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const registerHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        API_URL,
        {
          username,
          email,
          password,
        },
        registerHeader
      );

      console.log(data);
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError('');
      }, 10000);
    }
  };

  return (
    <form onSubmit={registerHandler} className="login-screen__form">
      <span className="error-message">{error}</span>
      <div className="form-group">
        <input
          type="text"
          required
          id="username"
          autoComplete="true"
          placeholder="Nazwa konta"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          tabIndex={0}
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          required
          id="email"
          autoComplete="true"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          tabIndex={0}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          required
          id="password"
          autoComplete="true"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          tabIndex={1}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Zarejestruj
      </button>
      <span className="registerLink">
        <p>posiadasz juz konto?</p>
        <a href="/login">Zaloguj się</a>
      </span>
    </form>
  );
};

export default RegisterUserView;
