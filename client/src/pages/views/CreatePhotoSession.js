import axios from 'axios';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userAuthHeader } from '../../helpers/httpHeaders';

const CreatePhotoSession = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');

    const API_URL = '/api/photo_session/create';

    const ImagesChange = (e) => {
        setImages(e.target.files);
    };

    const onUpload = async (e) => {
        e.preventDefault();

        let formData = new FormData();

        formData.append('title', title);

        Object.keys(images).map((key) => {
            return formData.append('images', images[key]);
        });

        await axios
            .post(API_URL, formData, userAuthHeader, {})
            .then((response) => {
                navigate('/edit/' + response.data._id);
            })
            .catch((error) => {
                setError(error);
            });
    };

    return (
        <form onSubmit={onUpload} className="login-screen__form">
            <span className="error-message">{error}</span>
            <div className="form-group">
                <label htmlFor="password">Podaj nazwę sesji</label>
                <input
                    type="text"
                    required
                    id="title"
                    autoComplete="false"
                    placeholder="Enter title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    tabIndex={0}
                />
            </div>
            <input type="file" onChange={ImagesChange} multiple />
            <button type="submit" className="btn btn-primary">
                Utwórz
            </button>
        </form>
    );
};

export default CreatePhotoSession;
