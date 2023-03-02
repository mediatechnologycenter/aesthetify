/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return {
                ...state,
                data: action.payload.data,
                clusteredData: action.payload.clusteredData,
                queryParams: action.queryParams
            };
        case 'SET_VIDEO_DATA':
            return {
                ...state,
                videoData: action.payload,
            };
        case 'SET_SELECTABLE_VIDEOS':
            return {
                ...state,
                selectableVideos: action.payload,
            }
        case 'SET_SELECTED_VIDEO':
            return {
                ...state,
                selectedVideo: action.payload,
            }
        case 'ADD_BAD_SHOT_SELECTION':
            return {
                ...state,
                badShots: [...new Set([...state.badShots, action.payload])]
            };
        case 'REMOVE_BAD_SHOT_SELECTION':
            return {
                ...state,
                badShots: state.badShots.filter(item => item.src !== action.payload.src)
            };
        case 'ADD_GOOD_SHOT_SELECTION':
            return {
                ...state,
                goodShots: [...new Set([...state.goodShots, action.payload])]
            };
        case 'REMOVE_GOOD_SHOT_SELECTION':
            return {
                ...state,
                goodShots: state.goodShots.filter(item => item.src !== action.payload.src),
            };
        case 'REMOVE_ALL_SHOT_SELECTION':
            return {
                ...state,
                badShots: [],
                goodShots: [],
            }
        case 'ADD_GOOD_IMAGE':
            return {
                ...state,
                goodImages: [...new Set([...state.goodImages, action.payload])]
            };
        case 'REMOVE_GOOD_IMAGE':
            return {
                ...state,
                goodImages: state.goodImages.filter(item => item.src !== action.payload.src),

            }
        case 'ADD_BAD_IMAGE':
            return {
                ...state,
                badImages: [...new Set([...state.badImages, action.payload])]
            };
        case 'REMOVE_BAD_IMAGE':
            return {
                ...state,
                badImages: state.badImages.filter(item => item.src !== action.payload.src),

            }
        case 'REMOVE_ALL_SELECTIONS':
            return {
                ...state,
                badImages: [],
                goodImages: [],
            }
        case 'UPDATE_GLOBAL_STATE_BOOL':
            return {
                ...state,
                loading: !state.loading
            }
        case 'UPDATE_UPLOADED_IMAGES_QUEUE':
            return {
                ...state,
                user_queue_size: action.payload.user_queue_size,
                total_queue_size: action.payload.total_queue_size,
                count_user_images: action.payload.count_user_images
            }
        default:
            return state;
    }
    function checkIfImageInData(image_name) {
        return state.data.some((image) => image.image_name === image_name)
    }
};

export default Reducer;