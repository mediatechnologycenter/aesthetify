/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import { IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Context } from '../utils/Store';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageList from '@material-ui/core/ImageList';
import globalVariables from '../utils/GlobalVariables';
import { downloadTxtFile } from '../components/subComponents/utils';
import { useStylesVideoModal } from './Styles';


export default function VideoModalGoodShots(props) {
    const { open, handleClose, onCloseButton } = props
    const [state, dispatch] = useContext(Context);
    const classes = useStylesVideoModal();

    const deleteImage = (imageData) => {
        dispatch({
            type: 'REMOVE_GOOD_SHOT_SELECTION', payload: imageData
        })
    }

    const ImageListObjects = state.goodShots.map((image, index) => {
        var imageSrc;
        try {
            imageSrc = `/video-api/video-server/shot-url?user_id=${image.user_id}&video_name=${image.video_name}&token=${image.token}&src=${image.src}`
        }
        catch {
            imageSrc = `${globalVariables.missingImageUrl}`
        }
        return (
            <>
                <ListItem key={index}>
                    <img width={200} height={100} src={imageSrc} style={{ objectFit: 'contain' }} alt={imageSrc}></img>
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteImage(image)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </>
        )
    })

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="shopping-basket"
                aria-describedby="list of all selected images"
            >
                <div className={classes.paper}>
                    <div style={{ position: 'absolute', top: 30, right: 30 }}>
                        <IconButton onClick={onCloseButton}>
                            <CloseIcon></CloseIcon>
                        </IconButton>
                    </div>
                    <ImageList style={{ maxHeight: '80%', overflow: 'auto' }}>
                        {ImageListObjects}
                    </ImageList>
                    <Button
                        style={{ position: 'absolute', bottom: 20 }}
                        variant={'contained'}
                        onClick={() => downloadTxtFile(state.goodShots, "goodShots")}
                        color={'primary'}>Download Good Shot Ids</Button>
                </div>
            </Modal>
        </div>
    );
}

VideoModalGoodShots.propTypes = {
    props: PropTypes.any,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    onCloseButton: PropTypes.func,
}