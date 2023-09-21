import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { callApi } from '../helpers/axios_helper';
import { getUser, login, logout } from '../helpers/auth_helper';
import AuthContent from './AuthContent';
import Buttons from './Buttons';
import styled from 'styled-components';


const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
  }

  img {
    max-width: 100%;
    height: auto;
    margin-top: 10px;
  }

  audio {
    width: 100%;
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
                    {apiData && (
                        <div>
                            <h1>{apiData.title}</h1>
                            <p>Artist: {apiData.artist.name}</p>
                            <p>Album: {apiData.album.title}</p>
                            <p>Length: {apiData.length}</p>
                            <p>Genre: {apiData.genre}</p>
                            {/* Render other fields as needed */}
                            {apiData.thumbnail && (
                                <img src={apiData.thumbnail} alt="Thumbnail" />
                            )}
                            {apiData.signedUrl && (
                                <audio controls>
                                    <source src={apiData.signedUrl} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </div>
                    )}
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
