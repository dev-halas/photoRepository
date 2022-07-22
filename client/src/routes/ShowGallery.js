import React from 'react';
import { Navigate } from 'react-router-dom';
import ShowGalleryView from '../pages/views/ShowGalleryView';

const ShowGalleryRoute = () => {
    const auth = localStorage.getItem("guestToken"); // determine if authorized, from context or however you're doing it

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return auth ? <ShowGalleryView/> : <Navigate to="/guest_login/:id" />;
}

export default ShowGalleryRoute;