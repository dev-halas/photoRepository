import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoLogOutOutline } from 'react-icons/io5';
import { guestAuthHeader } from '../../helpers/httpHeaders';

import Gallery, { ResponsiveMasonry } from 'react-responsive-masonry';

import '../css/ShowGalleryView.css';

const ShowGalleryView = () => {
    const [error, setError] = useState('');
    const [sessionData, setSessionData] = useState({
        title: '',
        coverPhoto: '',
    });
    const [largeImage, setLargeImage] = useState(0);
    const [imagesData, setImagesData] = useState([
        {
            image: '',
            thumbnail: '',
            chosen: Boolean,
        },
    ]);

    const logoutLink = '/guest_login/' + localStorage.getItem('photoSessionId');
    const SHOW_GALLERY_API_URL = '/api/photo_session/published/showGallery/';

    useEffect(() => {
        axios
            .get(SHOW_GALLERY_API_URL, guestAuthHeader)
            .then((response) => {
                setSessionData(response.data);
                setImagesData(response.data.images);
            })
            .catch((error) => {
                if (error.response) {
                    setError(error.response.data.message);
                }
            });
    }, []);

    const coverPhotoNotExist = imagesData[0].image;

    return (
        <div>
            {error}

            <div className="photoSessionCover">
                <div className="photoSessionCover--inner">
                    <h1>{sessionData.title}</h1>
                    <a href="#photo_session">Zobacz zdjęcia</a>
                </div>
                <img src={sessionData.coverPhoto ? sessionData.coverPhoto : coverPhotoNotExist} alt={sessionData.coverPhoto} />
            </div>
            <div className="photoSessionBar">
                <div className="photoSessionBar--left">
                    <p>{sessionData.title}</p>
                </div>
                <div className="photoSessionBar--right">
                    <button onClick={() => localStorage.removeItem('guestToken')}>
                        <Link to={logoutLink}>
                            <IoLogOutOutline size={32} />
                        </Link>
                    </button>
                </div>
            </div>

            <div className="showPhoto">
                <div className="showPhoto--bar">
                    <button>wyjdź</button>
                </div>
                <div className="showPhoto--container">
                    <div className="showPhoto--image">
                        <img src={imagesData[largeImage].thumbnail} alt="" />
                        <button onClick={() => setLargeImage(() => largeImage - 1)}>Prev</button>
                        <button onClick={() => setLargeImage(() => largeImage + 1)}>Next</button>
                    </div>
                </div>
            </div>

            <div className="photoSession" id="photo_session">
                <ResponsiveMasonry columnsCountBreakPoints={{ 750: 2, 900: 3, 1200: 4 }}>
                    <Gallery gutter="8px">
                        {imagesData.map((images, key) => (
                            <div className={'photo item_' + key} key={key}>
                                <img src={images.thumbnail} alt="" onClick={() => setLargeImage(key)} />
                                <div className="photo--menu">
                                    <div className={images.chosen ? 'checked' : 'unchecked'}></div>
                                </div>
                            </div>
                        ))}
                    </Gallery>
                </ResponsiveMasonry>
            </div>
        </div>
    );
};

export default ShowGalleryView;
