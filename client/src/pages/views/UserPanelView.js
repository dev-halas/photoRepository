import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import TopBar from '../../components/userPanel/TopBar';

import '../css/UserPanel.css';
import imgNotFound from '../../assets/img/imgNotFound.png';

const UserPanelView = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const API_URL = '/api/photo_session/all';
  const userToken = `Bearer ${localStorage.getItem('userToken')}`;
  const userHeader = {
    headers: {
      authorization: userToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  useEffect(() => {
    if (!userToken) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    axios
      .get(API_URL, userHeader)
      .then((response) => {
        setSessions(response.data);
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message);
        }
      });
  }, []);

  return (
    <div className="userPanel">
      {error}
      <TopBar />
      <div className="userPanel--sessions">
        {sessions.map((session) => (
          <a
            href={'/edit/' + session._id}
            className="userPanel--session"
            key={session._id}
          >
            <div className="userPanel--sessionInfo">
              <div className="sessionTitle">{session.title}</div>
            </div>
            {session.coverPhoto ? (
              <img src={session.coverPhoto} alt={session.title} />
            ) : (
              <img src={imgNotFound} alt={session.title} />
            )}
            {session.images.length} zdjęcia
          </a>
        ))}
      </div>
    </div>
  );
};

export default UserPanelView;
