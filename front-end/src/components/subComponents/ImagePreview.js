/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React, { useEffect, useState, useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ImageIcon from '@material-ui/icons/Image';
import Divider from '@material-ui/core/Divider';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Context } from '../../utils/Store'
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import { Box, IconButton } from '@material-ui/core';
import CameraEnhanceIcon from '@material-ui/icons/CameraEnhance';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import ClusterPreview from './ClusterPreview';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import DeleteIcon from '@material-ui/icons/Delete';
import { useStylesImagePreview } from './Styles';
const axios = require('axios');

const readableScaleDict = {
    '0': 'Extreme Close-up Shot', '1': 'Close-up Shot',
    '2': 'Medium Shot', '3': 'Full Shot', '4': 'Long Shot'
}
function ImagePreview(props) {
    var { onClick, data, src, token, images, onClickClusterImage } = props;
    var classes = useStylesImagePreview();
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

    const addToSelectedImage = (imageData) => {
        const choice = state.goodImages.some(e => e.image_id === imageData.image_id)
        if (choice) {
            dispatch({ type: "REMOVE_GOOD_IMAGE", payload: imageData })
        }
        else {
            dispatch({ type: "ADD_GOOD_IMAGE", payload: imageData })
        }
    }

    const addToSelectedBadImages = (imageData) => {
        const choice = state.badImages.some(e => e.image_id === imageData.image_id)
        if (choice) {
            dispatch({ type: "REMOVE_BAD_IMAGE", payload: imageData })
        }
        else {
            dispatch({ type: "ADD_BAD_IMAGE", payload: imageData })
        }
    }

    const deleteImage = (imageData) => {
        let config = {
            data: { 'imageId': imageData.image_id },
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${token}` },
        }

        axios.delete(`/api/image/${imageData.image_id}`, config).then(
            res => {
                dispatch({ type: "UPDATE_GLOBAL_STATE_BOOL" });
            }
        ).catch((error) => {
            console.error(error)

        })
        onClick()
    }

    var goodImageChoice = state.goodImages.some(e => e.image_id === data.image_id)
    var badImageChoice = state.badImages.some(e => e.image_id === data.image_id)

    var image_src_text = data.image_name;
    var maxStringLength = 20
    if (image_src_text.length > maxStringLength) image_src_text = `...${image_src_text.substr(image_src_text.length - maxStringLength)}`

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
                        <img
                            src={src}
                            alt={src}
                            width={'100%'}
                            height={'100%'}
                            style={{ objectFit: 'contain' }}>
                        </img>

                        <div style={{ position: 'absolute', left: '40%', bottom: -50 }}>
                            <IconButton onClick={() => addToSelectedImage(data)}>
                                <ThumbUpIcon color={goodImageChoice ? 'primary' : 'grey'}></ThumbUpIcon>
                            </IconButton>
                        </div>
                        <div style={{ position: 'absolute', left: '50%', bottom: -50 }}>
                            <IconButton onClick={() => addToSelectedBadImages(data)}>
                                <ThumbDownIcon color={badImageChoice ? 'primary' : 'grey'}></ThumbDownIcon>
                            </IconButton>
                        </div>
                        <div style={{ position: 'absolute', left: '60%', bottom: -50 }}>
                            <IconButton onClick={() => deleteImage(data)}>
                                <DeleteIcon color={'grey'}></DeleteIcon>
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
                                    <ImageIcon color={'primary'}></ImageIcon>
                                </ListItemIcon>
                                <ListItemText>Image name: {image_src_text}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <SupervisedUserCircleIcon color={'primary'} />
                                </ListItemIcon>
                                <ListItemText>Face Detections: {data.emotion.number_of_faces}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <AspectRatioIcon color={'primary'}></AspectRatioIcon>
                                </ListItemIcon>
                                <ListItemText>Image size: {`${data.width}, ${data.height}`}</ListItemText>
                            </ListItem>
                            {/* <ListItem>
                                <ListItemIcon>
                                    <GroupWorkIcon color={'primary'}></GroupWorkIcon>
                                </ListItemIcon>
                                <ListItemText>Image cluster: {`${data.clustering.cluster}`}</ListItemText>
                            </ListItem> */}
                            <ListItem>
                                <ListItemIcon>
                                    <CameraEnhanceIcon color={'primary'}></CameraEnhanceIcon>
                                </ListItemIcon>
                                <ListItemText>Shot Scale: {`${data.shot_scale.shot_scale}`}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <VisibilityIcon color={'primary'}></VisibilityIcon>
                                </ListItemIcon>
                                <ListItemText>Aesthetic Score: {`${(data.aesthetics.aesthetics_score).toFixed(2)}`}</ListItemText>
                            </ListItem>
                        </List>
                    </Box>
                </div>
                {/* <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Divider style={{ marginBlock: 10 }} variant="middle"></Divider>
                    <Box className={classes.titleTextOptions}>Image cluster</Box>
                    <div style={{ maxWidth: '80%', maxHeight: '100%' }}>
                        <ClusterPreview
                            images={images}
                            cluster={data.clustering.cluster}
                            onClickClusterImage={onClickClusterImage}></ClusterPreview>
                    </div>
                </div> */}
            </div>
        </div >
    )
}

ImagePreview.propTypes = {
    props: PropTypes.any,
    onClick: PropTypes.func,
    data: PropTypes.any,
    width: PropTypes.number,
    src: PropTypes.string,
    showImage: PropTypes.bool,
    images: PropTypes.array,
    onClickClusterImage: PropTypes.func,
}

export default ImagePreview