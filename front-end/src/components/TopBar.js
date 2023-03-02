/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React, { useEffect, useState, useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Badge from '@material-ui/core/Badge';
import ImageShoppingModal from './subComponents/ImageShoppingModal';
import ImageGarbageModal from './subComponents/ImageGarbageModal';
import { Context } from '../utils/Store';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Tooltip from '@material-ui/core/Tooltip';
import { sendImageSelectionToApi, get_number_of_images_in_queue } from './functions';
import { useStylesTopBar } from './Styles';
const axios = require('axios');

export default function TopAppBar(props) {
    const { user, onClickLogout, onSwitchApplication, token } = props
    const classes = useStylesTopBar();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [serverStatus, setServerStatus] = useState(200);
    const [state, dispatch] = useContext(Context);
    const [showShopping, setShowShopping] = useState(false);
    const [showBadImages, setShowBadImages] = useState(false);
    const [showDeleteInfo, setShowDeleteInfo] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState('');
    const [deleteStatus, setDeleteStatus] = useState(500);
    const [numUserImagesProcessing, setNumUserImagesProcessing] = useState(0)
    const [numTotalImagesProcessing, setNumTotalImagesProcessing] = useState(0)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAlert = () => {
        setShowDeleteInfo(false);
        setAnchorEl(null);
    };

    const handleClose = (event, reason) => {
        setShowDeleteInfo(false);
        setAnchorEl(null);
    };

    const handleLogout = () => {

        if (window.confirm("Are you sure you want to logout?")) {
            onClickLogout()
        }
    }

    const resetAndSendImageSelection = (token) => {
        if (window.confirm("Have you selected all your wished images? They will be reset after proceeding.")) {
            const goodImages = state.goodImages;
            const badImages = state.badImages;
            let imageObject = { 'goodImages': goodImages, 'badImages': badImages }
            sendImageSelectionToApi(imageObject, token, user)
            dispatch({ type: 'REMOVE_ALL_SELECTIONS' })
        }
        else {
            return null
        }
    }

    const CHECK_INTERVAL_MS = 5000;


    const handleRefresh = () => {
        get_number_of_images_in_queue(token, dispatch, state)
        dispatch({ type: "UPDATE_GLOBAL_STATE_BOOL" })
    }

    useEffect(() => {
        if (token) {
            get_number_of_images_in_queue(token, dispatch, state)
        }
    }, [])

    useEffect(() => {
        console.log("User uploaded images", state.user_queue_size)
        setNumUserImagesProcessing(state.user_queue_size)
        setNumTotalImagesProcessing(state.total_queue_size)
    }, [state.user_queue_size, state.total_queue_size])

    const deleteData = () => {
        let config = {
            data: { 'userId': user },
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${token}` },
        }

        let deleteDataEntry = prompt(`You are about to delete all data of user ${user}. Type -delete all- to confirm.`, "")
        if (deleteDataEntry === 'delete all') {
            axios.delete('/api/images', config).then(
                res => {
                    setDeleteInfo(res.data);
                    setDeleteStatus(res.status);
                    dispatch({ type: "UPDATE_GLOBAL_STATE_BOOL" });
                }
            ).catch((error) => {
                console.error(error)
                setDeleteInfo("An error occured!");
                setDeleteStatus(500);
            })
        }
        else {
            setDeleteInfo("Data deletion failed!");
            setDeleteStatus(500);
        }
        setShowDeleteInfo(true)
    }

    useEffect(() => {
    }, [state.goodImages])


    useEffect(() => {
        axios.get('/api/status').then(
            res => {
                const resStatus = res.status;
                setServerStatus(resStatus)
            }
        ).catch(
            (error) => {
                setServerStatus(500);
            }
        )
    }, [])

    return (
        <div className={classes.root}>
            <ImageShoppingModal
                token={token}
                open={showShopping}
                handleClose={() => setShowShopping(false)}
                onCloseButton={() => { setShowShopping(false) }}></ImageShoppingModal>
            <ImageGarbageModal
                token={token}
                open={showBadImages}
                handleClose={() => setShowBadImages(false)}
                onCloseButton={() => { setShowBadImages(false) }}></ImageGarbageModal>
            <AppBar position="static">
                <Toolbar className={classes.toolBar}>
                    <Box className={classes.leftToolBarObject}>

                        {/*
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => { onClickLogout(); handleClose() }}>Logout</MenuItem>
                            <MenuItem onClick={() => { handleClose(); onSwitchApplication() }}>Switch Application</MenuItem>
                            <MenuItem onClick={() => deleteData()}>Delete all data</MenuItem>
                        </Menu> */}
                        <Box className={classes.title}>
                            MTC Aesthetics Tool
                            <Box className={classes.serverStatus}>
                                <Typography style={{ textAlign: 'center', textJustify: 'center' }}>App Status: {serverStatus === 200 ? 'Running' : 'Error'}</Typography>
                                <Box
                                    marginLeft={1}
                                    border={2}
                                    borderColor={serverStatus === 200 ? 'white' : 'white'}
                                    width={10}
                                    height={10}
                                    borderRadius={10}
                                    bgcolor={serverStatus === 200 ? '#7cd992' : '#ff0033'}></Box>
                            </Box>
                            {<Typography style={{ textAlign: 'center', textJustify: 'center' }}>{`${numUserImagesProcessing && numUserImagesProcessing > 0 ? numUserImagesProcessing : 0} unprocessed images | ${numTotalImagesProcessing} images in global queue | ${state.count_user_images} processed images`}</Typography>}
                        </Box>
                    </Box>
                    <Box style={{
                        flexDirection: 'row',
                        display: 'flex',
                        alignItems: 'center'
                    }}>

                        {(numUserImagesProcessing !== 0) ?
                            <>
                                <Typography>Refresh images</Typography>
                                <Box>
                                    <Tooltip title='Refresh images' style={{ maxWidth: 100 }}>
                                        <IconButton onClick={handleRefresh}>
                                            <RotateLeftIcon style={{ color: "white", fontSize: 30 }}></RotateLeftIcon>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </>
                            :
                            <></>
                        }
                        <Box>
                            <Tooltip title='Show liked images'>
                                <IconButton onClick={() => setShowShopping(true)}>
                                    <Badge badgeContent={state.goodImages ? state.goodImages.length : 0} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} color="secondary">
                                        <ThumbUpIcon style={{ color: "white" }} ></ThumbUpIcon>
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box style={{ marginRight: 0 }}>
                            <Tooltip title="Show disliked images">
                                <IconButton onClick={() => setShowBadImages(true)}>
                                    <Badge badgeContent={state.badImages ? state.badImages.length : 0} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} color="secondary">
                                        <ThumbDownIcon style={{ color: "white" }} ></ThumbDownIcon>
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box>
                            <AccountCircleIcon />
                            <Typography variant="body1">{user}</Typography>
                        </Box>
                        <IconButton aria-label="logout" color="secondary" style={{ color: "white" }} onClick={handleLogout}>
                            <ExitToAppIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
                <Snackbar open={showDeleteInfo} severity={deleteStatus === 200 ? "success" : 'warning'} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleCloseAlert} severity="success">
                        {deleteInfo}
                    </Alert>
                </Snackbar>
            </AppBar>
        </div >
    );
}

TopAppBar.propTypes = {
    props: PropTypes.any,
    user: PropTypes.string,
    onClickLogout: PropTypes.func,
    onClickShoppingCart: PropTypes.func,
    onSwitchApplication: PropTypes.func
}