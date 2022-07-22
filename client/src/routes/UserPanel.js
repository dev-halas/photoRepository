import { Navigate } from 'react-router-dom';
import UserPanelView from '../pages/views/UserPanelView';


const UserPanelRoute = () => {
    const auth = localStorage.getItem("userToken"); // determine if authorized, from context or however you're doing it

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return auth ? <UserPanelView/> : <Navigate to="/login" />;
}

export default UserPanelRoute;