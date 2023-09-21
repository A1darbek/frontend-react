import React, { useState } from 'react';
import axios from 'axios';
import {getUser} from "../helpers/auth_helper";

const CreateSongForm = () => {
    const [songRequest, setSongRequest] = useState({
        title: '',
        artistId: '',  // Add artistId property
        albumId: '',   // Add albumId property
        length: '',    // Add length property
        genre: '',     // Add genre property
    });

    const [songFile, setSongFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSongRequest({
            ...songRequest,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('songFile', songFile);
        formData.append('imageFile', imageFile);

        // Merge songRequest and other fields into formData
        for (const key in songRequest) {
            formData.append(key, songRequest[key]);
        }

        try {
            const response = await callApiPost(formData);
            console.log('Song created successfully:', response.data);
            setIsLoading(false);
            setErrorMessage('');
            // Handle success or display a success message to the user
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage('Failed to create song. Please try again later.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="title"
                value={songRequest.title}
                onChange={handleChange}
                placeholder="Title"
            />
            <input
                type="text"
                name="artistId"
                value={songRequest.artistId}
                onChange={handleChange}
                placeholder="Artist ID"
            />
            <input
                type="text"
                name="albumId"
                value={songRequest.albumId}
                onChange={handleChange}
                placeholder="Album ID"
            />
            <input
                type="text"
                name="length"
                value={songRequest.length}
                onChange={handleChange}
                placeholder="Length"
            />
            <input
                type="text"
                name="genre"
                value={songRequest.genre}
                onChange={handleChange}
                placeholder="Genre"
            />
            {/* Rest of the form */}
            <label htmlFor="songFile">Select Song File:</label>
            <input type="file" onChange={(e) => setSongFile(e.target.files[0])} />
            <label htmlFor="imageFile">Select Image File:</label>
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Song'}
            </button>
            {errorMessage && <p>{errorMessage}</p>}
        </form>
    );
};

export default CreateSongForm;

const callApiPost = (data) => {
    return getUser().then((user) => {
        if (user && user.access_token) {
            const headers = {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${user.access_token}`,
            };
            return axios.post('http://localhost:8083/songs', data, { headers });
        } else {
            throw new Error('User is not logged in');
        }
    });
};
