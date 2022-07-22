
import  { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ShowGalleryRoute from './routes/ShowGallery';
import UserPanelRoute from './routes/UserPanel';
import GuestLoginView from './pages/views/GuestLoginView'
import UserLoginView from './pages/views/UserLoginView';
import CreatePhotoSession from './pages/views/CreatePhotoSession';



const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route exact path='/user_panel' element={<UserPanelRoute/>}/>
          <Route exact path='/login' element={<UserLoginView/>}/>
          <Route exact path='/createSession' element={<CreatePhotoSession/>}/>
          <Route exact path='/showGallery' element={<ShowGalleryRoute/>}/>
          <Route exact path='/guest_login/:id' element={<GuestLoginView/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App

