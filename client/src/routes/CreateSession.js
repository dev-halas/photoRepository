import { Navigate } from 'react-router-dom';
import CreatePhotoSession from '../pages/views/CreatePhotoSession';

const CreateSession = () => {
    const auth = localStorage.getItem("userToken"); // determine if authorized, from context or however you're doing it
    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return auth ? <CreatePhotoSession/> : <Navigate to="/login" />;
}

export default CreateSession