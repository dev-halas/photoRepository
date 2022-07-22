import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";

import Gallery, {ResponsiveMasonry} from "react-responsive-masonry"

import '../css/ShowGalleryView.css'

const ShowGalleryView = () => {
    const navigate = useNavigate('')
    
    const [error, setError] = useState("");
    const [sessionData, setSessionData] = useState({
        title: "",
        firstPhoto: ""
    });
    const [imagesData, setImagesData] = useState([])
    
    const logoutLink = '/guest_login/' + localStorage.getItem("photoSessionId")
    const SHOW_GALLERY_API_URL = '/api/photo_session/published/showGallery/'
    const guestToken = `Bearer ${localStorage.getItem("guestToken")}`
    const guestHeader = {
        headers: {
            'authorization': guestToken,
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        }
    }

    useEffect(() => {
        axios.get(SHOW_GALLERY_API_URL, guestHeader )
        .then(response => {
            setSessionData(response.data);
            setImagesData(response.data.images)
        })
        .catch((error) => {
            if (error.response) {
                setError(error.response.data.message)
            }
        });

    },[])

    const firstPhotoNotExist = imagesData[0]
    
    return (
        <div>
            {error}

            <div className="photoSessionCover">
                <div className="photoSessionCover--inner">
                    <h1>{sessionData.title}</h1>
                    <a href="#photo_session">Zobacz zdjęcia</a>
                </div>
                <img src={ sessionData.firstPhoto ?
                    sessionData.firstPhoto : firstPhotoNotExist
                    } alt={sessionData.firstPhoto} />
            </div>
            <div className="photoSessionBar">
                <div className="photoSessionBar--left">
                    <p>{sessionData.title}</p>
                </div>
                <div className="photoSessionBar--right">
                    <button onClick={() => localStorage.removeItem("guestToken")}>
                        <Link to={logoutLink}>
                            <IoLogOutOutline size={32}/>
                        </Link>
                    </button>
                </div>
            </div>
            <div className="photoSession" id="photo_session">
                <ResponsiveMasonry columnsCountBreakPoints={{ 750: 2, 900: 3, 1200: 4}}>
                    <Gallery gutter="8px">
                    {
                        imagesData.map((images, index) => (
                            <div className={'photo item_' +index } key={index}>
                                <img className={index} src={images.image} alt="" />
                                <div className="photo--menu">
                                    <div className={images.chosen ? "checked" : "unchecked"}></div>
                                </div>
                            </div>
                        ))
                    }
                    </Gallery>
                </ResponsiveMasonry>
            </div>
        </div>
    )
}

export default ShowGalleryView
