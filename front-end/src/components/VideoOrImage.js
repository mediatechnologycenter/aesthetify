/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import VideocamIcon from '@material-ui/icons/Videocam';
import background3 from '../static-media/background_3.png';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundImage: `url(${background3})`,
        backgroundSize: 'cover',
    },
    button: {
        width: '40vh',
        height: '40vh',
        borderRadius: '10vh',
        margin: theme.spacing(5),
        background: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        transition: 'opacity 300ms ease',
        '&:hover': {
            opacity: 0.7
        },
        '&:active': {
            opacity: 0.3
        }
    },
    icon: {
        height: '60%',
        fontSize: '25vh',
        color: '#fd2e58'
    },
    text: {
        fontSize: '5vh',
    }
}))


export default function VideoOrImage(props) {
    const { onClickImage, onClickVideo } = props
    var classes = useStyles();
    return (
        <div className={classes.root}>
            <Box
                className={classes.button}
                onClick={onClickImage}>
                <PhotoCameraIcon className={classes.icon}></PhotoCameraIcon>
                <Box className={classes.text}>Image</Box>
            </Box>
            <Box className={classes.button} onClick={onClickVideo}>
                <VideocamIcon className={classes.icon}></VideocamIcon>
                <Box className={classes.text}>Video</Box>
            </Box>


        </div>
    )
}

VideoOrImage.propTypes = {
    props: PropTypes.any,
    onClickImage: PropTypes.func,
    onClickVideo: PropTypes.func,
}