import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const CreateGallery = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const API_URL = '/api/photo_session/create';
    const userToken = `Bearer ${localStorage.getItem('userToken')}`;
    const createHeader = {
        headers: {
            Authorization: userToken,
            'Content-Type': 'multipart/form-data',
        },
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('title', title);

        await axios
            .post(API_URL, formData, createHeader, {})
            .then((response) => {
                console.log(response.data);
                navigate('/editGallery/' + response.data._id);
            })
            .catch((error) => {
                setError(error);
            });
    };

    return (
        <Wrapper>
            <Inner>
                <InnerHeader>Tworzenie Galerii</InnerHeader>
                <Content>
                    <form onSubmit={onSubmitHandler}>
                        {error}
                        <label htmlFor="">
                            <span>Wpisz jak będzie nazywać się sesja</span>
                            <input type="text" placeholder='na przykład: "Ślub Tomka i Anii..."' onChange={(e) => setTitle(e.target.value)} />
                        </label>
                        <button type="submit" className="btn btn-primary">
                            Utwórz
                        </button>
                    </form>
                </Content>
            </Inner>
        </Wrapper>
    );
};

export default CreateGallery;

const Wrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Inner = styled.div`
    width: 800px;
    max-width: 100%;
    height: auto;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const InnerHeader = styled.div`
    padding: 30px 5vw;
    background-color: #ededed;
    font-size: 30px;
`;

const Content = styled.div`
    padding: 5vw;

    input {
        display: block;
        width: 100%;
        margin-top: 10px;
        padding: 10px;
        border: 1px solid #ddd;
    }

    input::placeholder {
        color: #aaa;
    }
`;
