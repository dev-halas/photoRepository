import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Gallery, { ResponsiveMasonry } from 'react-responsive-masonry';

const GalleryUpload = () => {
    const [images, setImages] = useState([
        {
            image: '',
        },
    ]);
    const [previewImages, setPreviewImages] = useState([]);
    const [error, setError] = useState('');

    const params = useParams();
    const sessionID = params.id;

    const API_URL = `/api/photo_session/uploadImages/${sessionID}`;
    const userToken = `Bearer ${localStorage.getItem('userToken')}`;
    const createHeader = {
        headers: {
            Authorization: userToken,
            'Content-Type': 'multipart/form-data',
        },
    };

    const galleryChange = (e) => {
        setImages(e.target.files);

        /*
        const selectedFiles = [];
        const targetFiles = e.target.files;
        const targetFilesObject = [...targetFiles]
        targetFilesObject.map((prev)=>{
            selectedFiles.push(URL.createObjectURL(prev))
         })
        setPreviewImages(selectedFiles);
      
        */
        //setPreviewImages(URL.createObjectURL(e.target.files[0]));
    };

    const galleryUpload = async (e) => {
        e.preventDefault();

        let formData = new FormData();

        Object.keys(images).map((key) => {
            return formData.append('images', images[key]);
        });

        await axios
            .put(API_URL, formData, createHeader, {})
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                setError(error);
            });
    };

    console.log(previewImages);

    return (
        <form onSubmit={galleryUpload} className="login-screen__form">
            <span className="error-message">{error}</span>
            <input type="file" onChange={galleryChange} multiple />

            <button type="submit" className="btn btn-primary">
                Zapisz
            </button>
        </form>
    );
};

export default GalleryUpload;
