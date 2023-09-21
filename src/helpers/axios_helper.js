import axios from 'axios';
import { getUser } from './auth_helper';
import {useEffect, useState} from "react";


const _callApi = (token) => {
    const headers = {
        Accept: "application/json",
        Authorization: "Bearer " + token
    };
    return axios.get("http://localhost:8083/songs/1", { headers });
}

export const callApi = () => {
    return getUser().then(user => {
        if (user && user.access_token) {
            return _callApi(user.access_token).catch(error => {
                throw error;
            });
        } else {
            throw new Error('user is not logged in');
        }
    });
}