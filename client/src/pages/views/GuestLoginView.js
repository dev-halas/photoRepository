import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { loginHeader } from '../../helpers/httpHeaders';

import '../css/GuestLoginView.css';

const GuestLoginView = () => {
  const navigate = useNavigate();
  const params = useParams();
  const sessionID = params.id;

  const API_URL = `/api/photo_session/guest/${sessionID}`;

  const [password, setPassword] = useState('');
  const [sessionData, setSessionData] = useState({
    coverPhoto: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(API_URL, loginHeader)
      .then((response) => {
        setSessionData(response.data);
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message);
        }
      });
  }, [API_URL]);

  useEffect(() => {
    if (localStorage.getItem('guestToken')) {
      navigate('/showGallery');
    }
  }, [navigate]);

  const guestLoginHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        API_URL,
        { password },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      localStorage.setItem('guestToken', data.token);
      localStorage.setItem('photoSessionId', data._id.toString());

      navigate('/showGallery');
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError('');
      }, 10000);
    }
  };

  return (
    <div
      className="guestLogin"
      style={{
        backgroundImage: `url(/${sessionData.coverPhoto})`,
        backgroundSize: 'cover',
      }}
    >
      <div className="guestLogin--inner">
        <h2>{sessionData.title}</h2>

        <form onSubmit={guestLoginHandler} className="login-screen__form">
          <span className="error-message">{error}</span>
          <div className="form-group">
            <label htmlFor="password">
              Wpisz hasło aby uzyskać dostęp do sesji zdjęciowej
            </label>
            <input
              type="password"
              required
              id="clientPassword"
              autoComplete="true"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              tabIndex={0}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuestLoginView;
