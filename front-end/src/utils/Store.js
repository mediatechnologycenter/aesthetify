/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

/* eslint-disable react/prop-types */
import React, { createContext, useReducer } from "react";
import Reducer from './Reducer';
import PropTypes from 'prop-types';


const initialState = {
    data: [],
    videoData: [],
    selectableVideos: [],
    selectedVideo: "",
    error: null,
    loggedIn: false,
    clusteredData: [],
    queryParams: {},
    goodImages: [],
    badImages: [],
    badShots: [],
    goodShots: [],
    loading: true,
    user_queue_size: 0,
    total_queue_size: 0,
    count_user_images: 0,
};

function Store({ children }) {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

Store.prototype = {
    children: PropTypes.any,
}

export const Context = createContext(initialState);
export default Store;