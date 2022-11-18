import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ShowGalleryRoute from './routes/ShowGallery';
import UserPanelRoute from './routes/UserPanel';
import GuestLoginView from './pages/views/GuestLoginView';
import UserLoginView from './pages/views/UserLoginView';
import CreatePhotoSession from './pages/views/CreatePhotoSession';
import UpdateSession from './pages/views/UpdateSession';
import RegisterUserView from './pages/views/register/RegisterUserView';
import EditSession from './pages/views/EditSession';
import CreateGallery from './pages/views/CreateGallery';
import CoverUpload from './pages/views/CoverUpload';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route exact path="/user_panel" element={<UserPanelRoute />} />
                    <Route exact path="/login" element={<UserLoginView />} />
                    <Route exact path="/register" element={<RegisterUserView />} />
                    <Route exact path="/createSession" element={<CreatePhotoSession />} />
                    <Route exact path="/edit/:id" element={<UpdateSession />} />
                    <Route exact path="/showGallery" element={<ShowGalleryRoute />} />
                    <Route exact path="/guest_login/:id" element={<GuestLoginView />} />

                    <Route exact path="/create" element={<CreateGallery />} />
                    <Route exact path="/editGallery/:id" element={<EditSession />} />
                    <Route exact path="/coverUpload/:id" element={<CoverUpload />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
