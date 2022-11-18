import axios from 'axios';
import React from 'react';
//import TopBar from '../../components/userPanel/TopBar';
import styled from 'styled-components';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const EditSession = () => {
    const [galleryData, setGalleryData] = useState({
        title: '',
        published: false,
        images: [{ image: '' }],
        clientPassword: '',
    });
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

    const editHandler = async (e) => {
        e.preventDefault();

        let formData = new FormData();

        formData.append('title', galleryData.title);
        //formData.append('clientPassword', galleryData.clientPassword);
        formData.append('published', galleryData.published);

        await axios
            .put(API_URL, formData, createHeader, {})
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                setError(error);
            });
    };

    const handleOnChange = () => {
        setGalleryData({ published: !galleryData.published });
    };

    return (
        <div>
            <Wrapper>
                <form onSubmit={editHandler}>
                    {error}
                    <input
                        type="text"
                        onChange={(e) => {
                            setGalleryData({ title: e.target.value });
                        }}
                        value={galleryData.title}
                    />
                    <input
                        type="checkbox"
                        checked={galleryData.published}
                        onChange={() => {
                            setGalleryData({ published: !galleryData.published });
                        }}
                    />
                    <button type="submit" className="btn btn-primary">
                        Zapisz
                    </button>
                </form>
            </Wrapper>
        </div>
    );
};

export default EditSession;

const Wrapper = styled.div`
    width: min(80vw, 1600px);
    margin: auto;
`;
