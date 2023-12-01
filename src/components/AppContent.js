import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { callApi } from '../helpers/axios_helper';
import { getUser, login, logout } from '../helpers/auth_helper';
import AuthContent from './AuthContent';
import Buttons from './Buttons';
import styled from 'styled-components';


const AppContainer = styled.div`
  font-family: 'Helvetica Neue', sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #282828;
  border-radius: 10px;
  background-color: #121212;
  color: #fff;

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #1db954; /* Spotify Green */
  }

  p {
    margin: 5px 0;
    color: #b3b3b3; /* Light gray text */
  }

  img {
    max-width: 100%;
    height: auto;
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  audio {
    width: 100%;
    height: 40px; /* Add a fixed height */
    margin-top: 10px;
  }

`;

export default class AppContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: {}, api: "" };
        this.shouldCancel = false;
    }

    componentDidMount() {
        this.getUser();
    }

    login = () => {
        login();
    };

    callApi = () => {
        callApi()
            .then(response => {
                const apiData = response.data; // Assuming the API response contains the necessary fields
                this.setState({ apiData });
                toast.success('API returned data successfully.');
            })
            .catch(error => {
                toast.error(error);
            });
    };

    componentWillUnmount() {
        this.shouldCancel = true;
    }

    logout = () => {
        logout();
    };

    getUser = () => {
        getUser().then(user => {
            if (user) {
                toast.success('User has been successfully loaded from store.');
            } else {
                toast.info('You are not logged in.');
            }

            if (!this.shouldCancel) {
                this.setState({ user });
            }
        });
    };

    render() {
        const { apiData } = this.state;
        return (
            <>
                <AppContainer>
                    {apiData && apiData.map(song => (
                        <div key={song.id}>
                            <h1>{song.title}</h1>
                            <p>Artist: {song.artist.name}</p>
                            <p>Album: {song.album.title}</p>
                            <p>Length: {song.length}</p>
                            <p>Genre: {song.genre}</p>
                            {/* Render other fields as needed */}
                            {song.thumbnail && <img src={song.thumbnail} alt="Thumbnail" />}
                            {song.signedUrl && (
                                <audio controls>
                                    <source src={song.signedUrl} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </div>
                    ))}
                </AppContainer>

                <ToastContainer />

                <Buttons
                    login={this.login}
                    logout={this.logout}
                    getUser={this.getUser}
                    callApi={this.callApi}
                />

                {this.state.api && <AuthContent data={this.state.api} user={this.state.user} />}
            </>
        );
    }

}
