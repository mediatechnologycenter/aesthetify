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
import { Context } from '../../utils/Store';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageList from '@material-ui/core/ImageList';
import globalVariables from '../../utils/GlobalVariables';
import { downloadTxtFile } from './utils';
import { useStylesImageGarbageModal } from './Styles';

export default function ImageGarbageModal(props) {
    const { open, handleClose, onCloseButton } = props
    const [state, dispatch] = useContext(Context);
    const classes = useStylesImageGarbageModal();

    const deleteImage = (imageData) => {
        dispatch({ type: 'REMOVE_BAD_IMAGE', payload: imageData })
    }

    const ImageListObjects = state.badImages.map((image, index) => {
        var imageSrc;
        try {
            if (process.env.REACT_APP_THUMBNAIL_ACTIVE) {
                imageSrc = `/api/image-server/image?userId=${image.user_id}&size=thumbnail&image_id=${image.image_id}` 
            }
            else {
                imageSrc = `/api/image-server/image?userId=${image.user_id}&size=original&image_id=${image.image_id}`
            }
        }
        catch {
            imageSrc = `${globalVariables.missingImageUrl}`
        }
        return (
            <>
                <ListItem key={index}>
                    <img width={200} height={100} alt={imageSrc} src={imageSrc} style={{ objectFit: 'contain' }}></img>
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
                        onClick={() => downloadTxtFile(state.badImages, "badImages")}
                        // onClick={() => sendImageSelectionToApi(state.badImages)}
                        color={'primary'}>Download Bad Image Ids</Button>
                </div>
            </Modal>
        </div>
    );
}

ImageGarbageModal.propTypes = {
    props: PropTypes.any,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    onCloseButton: PropTypes.func,
}