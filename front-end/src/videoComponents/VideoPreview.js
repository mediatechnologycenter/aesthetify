/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React, { useEffect, useState, useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Context } from '../utils/Store';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import { Box, IconButton } from '@material-ui/core';
import CameraEnhanceIcon from '@material-ui/icons/CameraEnhance';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { useStylesVideoPreview } from './Styles';
import VideoComponent from './videoComponent';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';

export default function VideoPreview(props) {
    var { onClick, data, src } = props;
    var classes = useStylesVideoPreview();
    const [state, dispatch] = useContext(Context);
    var [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
        const position = window.pageYOffset
        setScrollPosition(position)
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const addToSelectedVideos = (imageData) => {
        const choice = state.goodShots.some(e => e.src === imageData.src)
        if (choice) {
            dispatch({ type: "REMOVE_GOOD_SHOT_SELECTION", payload: imageData })
        }
        else {
            dispatch({ type: "ADD_GOOD_SHOT_SELECTION", payload: imageData })
        }
    }

    const addToSelectedBadVideos = (imageData) => {
        const choice = state.badShots.some(e => e.src === imageData.src)
        if (choice) {
            dispatch({ type: "REMOVE_BAD_SHOT_SELECTION", payload: imageData })
        }
        else {
            dispatch({ type: "ADD_BAD_SHOT_SELECTION", payload: imageData })
        }
    }

    var goodImageChoice = state.goodShots.some(e => e.src === data.src)
    var badImageChoice = state.badShots.some(e => e.src === data.src)

    var image_src_text = data.src;
    var maxStringLength = 20
    if (image_src_text.length > maxStringLength) image_src_text = `...${image_src_text.substr(image_src_text.length - maxStringLength)}`
    var videoName = data.video_name.replace(/\.[^/.]+$/, "");
    var video_url = `/video-api/video-server/video-url?user_id=${data.user_id}&video_name=${videoName}&shot_src=${data.shot_src}&token=${data.token}`

    return (
        <div style={{
            position: 'absolute',
            flexDirection: 'column',
            display: 'flex',
            width: '100%',
            height: '100vh',
            left: 0,
            top: 0 + Math.max(window.pageYOffset, scrollPosition),
            bottom: 0,
            right: 0,
            zIndex: 900,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: "rgba(192,192,192, 0.9)",
        }}>
            <div className={classes.previewContainer}>
                <div style={{ position: 'absolute', top: 10, right: 30 }}>
                    <IconButton onClick={onClick}>
                        <CloseIcon></CloseIcon>
                    </IconButton>
                </div>
                <div style={{
                    flexDirection: 'row',
                    display: 'flex',
                    flex: 2,
                }}>
                    <div className={classes.imageContainer}>
                        <VideoComponent videoUrl={video_url} thumbnailUrl={src}></VideoComponent>
                        <div style={{ position: 'absolute', left: '46%', bottom: -50 }}>
                            <IconButton onClick={() => addToSelectedVideos(data)}>
                                <ThumbUpIcon color={goodImageChoice ? 'primary' : 'grey'}></ThumbUpIcon>
                            </IconButton>
                        </div>
                        <div style={{ position: 'absolute', left: '52%', bottom: -50 }}>
                            <IconButton onClick={() => addToSelectedBadVideos(data)}>
                                <ThumbDownIcon color={badImageChoice ? 'primary' : 'grey'}></ThumbDownIcon>
                            </IconButton>
                        </div>
                    </div>
                    <Box style={{
                        justifyContent: 'start',
                        alignItems: 'center',
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'row',
                    }}>

                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <AspectRatioIcon color={'primary'}></AspectRatioIcon>
                                </ListItemIcon>
                                <ListItemText>Video Name: {`${data.shot_src}`}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <DirectionsRunIcon color={'primary'}></DirectionsRunIcon>
                                </ListItemIcon>
                                <ListItemText>Shot Movement: {`${data.shotMovement}`}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <VisibilityIcon color={'primary'}></VisibilityIcon>
                                </ListItemIcon>
                                <ListItemText>Aesthetic Score: {`${data.aestheticScore}`}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CameraEnhanceIcon color={'primary'}></CameraEnhanceIcon>
                                </ListItemIcon>
                                <ListItemText>Shot Scale: {`${data.shotScale}`}</ListItemText>
                            </ListItem>
                        </List>
                    </Box>
                </div>
            </div>
        </div >
    )
}

VideoPreview.propTypes = {
    props: PropTypes.any,
    onClick: PropTypes.func,
    data: PropTypes.any,
    width: PropTypes.number,
    src: PropTypes.string,
    showImage: PropTypes.bool,
}