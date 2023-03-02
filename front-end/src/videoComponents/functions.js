/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

const axios = require('axios');
var qs = require('qs');

const getVideos = async (user_id) => {
    var params = {
        "userId": user_id,
    };

    var config = {
        method: 'get',
        url: '/video-api/video/all',
        headers: {},
        params: params, 'paramsSerializer': function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    };
    try {
        let response = await axios(config)
        return response
    }
    catch (error) {
        console.error(error)
        return error
    }
}

const getQueryOfShots = async (params, token) => {

    var config = {
        method: 'get',
        url: '/video-api/shots/query',
        headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${token}` },
        params: params, 'paramsSerializer': function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    };
    try {
        let response = await axios(config)
        return response
    }
    catch (error) {
        console.error(error.response)
        return error
    }
}

const getShotsOfVideo = async (user_id, video_id, token) => {
    var params = {
        "user_id": user_id,
        "video_id": video_id
    };

    var config = {
        method: 'get',
        url: '/video-api/shots/all',
        headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${token}` },
        params: params, 'paramsSerializer': function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    };
    try {
        let response = await axios(config)
        return response
    }
    catch (error) {
        console.error(error)
        return error
    }
}

const deleteOneVideoAndShots = async (user_id, video_id, token) => {
    var params = {
        "user_id": user_id,
        "video_id": video_id
    };

    var config = {
        method: 'delete',
        url: '/video-api/video',
        headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${token}` },
        params: params, 'paramsSerializer': function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    };
    try {
        let response = await axios(config)
        return response
    }
    catch (error) {
        console.error(error)
        return error
    }
}

const getApiStatus = async () => {
    try {
        let response = await axios.get('/video-api/status')
        return response
    }
    catch (error) {
        console.error("Status couldn't be fetched...")
        return { error: error, status: 500 }
    }
}

const sendImageSelectionToApi = (selection, authToken, user) => {
    let data = {
        'selection': selection,
        'userId': user,
    }

    const config = {
        headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${authToken}` }
    }

    axios.post('/video-api/video/selection', data, config).then(
        (response) => {
            return response
        }).catch(
            (error) => {
                console.error(error)
                return error
            })
}

const downloadTxtFile = (value, selection_type) => {
    const element = document.createElement("a");
    const beautifiedTxtFile = value.map((el) => {
        return el.src
    })
    const file = new Blob([JSON.stringify(beautifiedTxtFile)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selection_type}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

export { downloadTxtFile }

export { getVideos, getShotsOfVideo, getQueryOfShots, sendImageSelectionToApi, getApiStatus, deleteOneVideoAndShots }