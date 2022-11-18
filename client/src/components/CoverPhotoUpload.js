import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CoverPhotoUpload = () => {
  const [cover, setCover] = useState({
    coverPhoto: '',
  });
  const [error, setError] = useState('');

  const params = useParams();
  const sessionID = params.id;

  const COVER_UPLOAD_API_URL = `/api/photo_session/coverPhoto/${sessionID}`;

  const userToken = `Bearer ${localStorage.getItem('userToken')}`;
  const createHeader = {
    headers: {
      Authorization: userToken,
      'Content-Type': 'multipart/form-data',
    },
  };

  const coverChange = (e) => {
    setCover(e.target.files[0]);
  };

  const coverUpload = async (e) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append('cover', cover);

    await axios
      .put(COVER_UPLOAD_API_URL, formData, createHeader, {})
      .then((response) => {
        console.log(response.data);
        console.log(cover);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <form onSubmit={coverUpload} className="login-screen__form">
      <span className="error-message">{error}</span>
      <input type="file" onChange={coverChange} />
      <button type="submit" className="btn btn-primary">
        Zapisz
      </button>
    </form>
  );
};

export default CoverPhotoUpload;
