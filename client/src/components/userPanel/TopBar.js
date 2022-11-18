import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { IoPersonOutline, IoAddOutline } from "react-icons/io5";


import Logo from '../Logo'
import '../../pages/css/userPanel/TopBar.css'

const TopBar = () => {
    
    const [open, setOpen] = useState(false)
    const [userData, setUserData] = useState({
        username: '',
        email: ''
    })
    const [error, setError] = useState()

    const API_URL = 'api/user/panel'
    const userToken = `Bearer ${localStorage.getItem("userToken")}`
    const userHeader = {
        headers: {
            'authorization': userToken,
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        }
    }

    useEffect(() =>{
        axios.get(API_URL, userHeader)
        .then(response => {
            setUserData(response.data);
        })
        .catch((error) => {
            if (error.response) {
                setError(error.response.data.message)
            }
        });
    
    },[])
    


    return (
        <>
            <div className="userPanel--bar">
                <div className="barInner">
                    <div className="barInner--left">
                        <Logo/>
                    </div>
                    <div className="barInner--right">
                        <button className="barMenu--addSession">
                            <IoAddOutline size={20}/>
                            <Link to='/createSession'>Dodaj sesję zdjęciową</Link>
                        </button>
                        <button className="barMenu--button" onClick={() => setOpen(!open)}>
                            <IoPersonOutline size={20}/>
                        </button>
                        <div className={open ? 'barMenu --active' : 'barMenu'}>
                            <div className="barMenu--userInfo"> 
                                {userData.username}
                                {userData.email}
                            </div>
                            <ul>
                                <li><Link to='#'>Socialmedia</Link></li>
                                <li><Link to='#'>Ustawienia</Link></li>
                                <li><Link onClick={() => localStorage.removeItem("userToken")} to='/login'>Wyloguj</Link></li>
                            </ul>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="userPanel--barDistance"></div>
        </>
    )
}

export default TopBar