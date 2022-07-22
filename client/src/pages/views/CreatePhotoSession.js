import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreatePhotoSession = () => {
    const[title, setTitle] = useState("")
    const[images, setImages] = useState([])
    const[error, setError] = useState("")
    
    const navigate = useNavigate()

    const API_URL = '/api/photo_session/create'
    const userToken = `Bearer ${localStorage.getItem("userToken")}`
    const createHeader = {
        headers: {
            'authorization': userToken,
            //'Accept' : 'application/json',
            //Content-Type': 'application/json',
            'Content-Type': 'multipart/form-data'
        }
    }

    useEffect(() => {
        if (!userToken) navigate('/login')
    },[navigate])

    const onFileChange = (e) => {
        setImages({ images: e.target.files })
    }


    const createSessionHandler = async (e) => {
        e.preventDefault()
        
        const formData = new FormData();
        for (const key of Object.keys(images)) {
            formData.append('image', images[key])
        }

        try {
            const response = axios.post(API_URL, formData,
                createHeader
            ).then((response) =>{
                console.log(response)
            })

        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const addFiles = (e) => {
        const files = e.target.files;
            let array = []
            for (let i = 0; i < files.length; i++) {
              const imgSrc = files[i];
              array = [...array, {image: imgSrc.name}]
              
        }
        setImages(array)
        
    }

    return (
        <form onSubmit={createSessionHandler} className="login-screen__form">
            <span className="error-message">{error}</span>
            <div className="form-group">
              <label htmlFor="password">
                Wpisz hasło aby uzyskać dostęp do sesji zdjęciowej
              </label>
              <input
                type="text"
                required
                id="title"
                autoComplete="false"
                placeholder="Enter title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                tabIndex={0}
              />
            </div>
            <input type="file" onChange={onFileChange}  multiple/>
            <button type="submit" className="btn btn-primary">
              Utwórz
            </button>
          </form>
    )
}

export default CreatePhotoSession