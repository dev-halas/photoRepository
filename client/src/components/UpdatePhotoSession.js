import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const UpdatePhotoSession = () => {
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');

  const params = useParams();
  const sessionID = params.id;

  const API_URL = `/api/photo_session/update/${sessionID}`;
  const userToken = `Bearer ${localStorage.getItem('userToken')}`;
  const createHeader = {
    headers: {
      Authorization: userToken,
      'Content-Type': 'multipart/form-data',
    },
  };

  const galleryUpdate = async (e) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append('title', title);
    formData.append('clientPassword', password);
    formData.append('published', true);

    await axios
      .put(API_URL, formData, createHeader, {})
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <form onSubmit={galleryUpdate} className="login-screen__form">
      <span className="error-message">{error}</span>
      <div className="form-group">
        <label htmlFor="title">Nazwa sesji</label>
        <input
          type="text"
          id="title"
          autoComplete="false"
          placeholder="Enter title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          tabIndex={0}
        />
      </div>
      <div className="form-group">
        <label htmlFor="title">hasło do galerii</label>
        <input
          type="text"
          id="password"
          autoComplete="false"
          placeholder="Enter title"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          tabIndex={1}
        />
      </div>
      <div className="form-group">
        <label htmlFor="published">Opublikować?</label>
        <input
          type="checkbox"
          id="published"
          onChange={(e) => setPublished(e.target.checked)}
          checked={published}
          tabIndex={2}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Zapisz
      </button>
    </form>
  );
};

export default UpdatePhotoSession;
