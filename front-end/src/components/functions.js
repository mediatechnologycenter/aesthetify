/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

const axios = require('axios');

const sendImageSelectionToApi = (selection, authToken, user) => {
    let data = {
        'selection': selection,
        'userId': user,
    }

    const config = {
        headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${authToken}` }
    }

    axios.post('/api/image/selection', data, config).then(
        () => {
        }).catch(
            (error) => {
                console.error(error)
            })
}

function get_number_of_images_in_queue(token, dispatch, state) {
    console.log("Number of uploaded images:", state.user_queue_size)
    axios.get("/api/queue-size",
        {
            headers: { "Authorization": `Bearer ${token}` },
        }).then(res => {
            console.log("Queue count result", res)
            var reqData = res.data;
            dispatch({ type: "UPDATE_UPLOADED_IMAGES_QUEUE", payload: reqData });

        }).catch((error) => {
            console.error(error)
        })
}

export { sendImageSelectionToApi, get_number_of_images_in_queue }

