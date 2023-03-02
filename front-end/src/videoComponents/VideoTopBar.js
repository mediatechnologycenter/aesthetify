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
import { Context } from '../utils/Store';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Tooltip from '@material-ui/core/Tooltip';
import { sendImageSelectionToApi, getApiStatus, getVideos, deleteOneVideoAndShots } from './functions';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import { useStylesTopBar } from '../components/Styles';
import VideoModalGoodShots from './VideoModalGoodShots';
import VideoModalBadShots from './VideoModalBadShots';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import RefreshIcon from '@material-ui/icons/Refresh';

export default function VideoTopBar(props) {
    const { user, onClickLogout, onSwitchApplication, token } = props
    const classes = useStylesTopBar();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorVideoList, setAnchorVideoList] = React.useState(null);
    const [serverStatus, setServerStatus] = useState(200);
    const [state, dispatch] = useContext(Context);
    const [showShopping, setShowShopping] = useState(false);
    const [showBadImages, setShowBadImages] = useState(false);
    const [showDeleteInfo, setShowDeleteInfo] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState('');
    const [deleteStatus, setDeleteStatus] = useState(500);
    const [updateAfterDelete, setUpdateAfterDelete] = useState(false)

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

    const handleVideoListClose = (event, reason) => {
        setAnchorVideoList(null);
    };

    const resetAndSendImageSelection = (token) => {
        if (window.confirm("Have you selected all your wished shots? They will be reset after proceeding.")) {
            const goodShots = state.goodShots;
            const badShots = state.badShots;
            let imageObject = { 'goodImages': goodShots, 'badImages': badShots }
            sendImageSelectionToApi(imageObject, token, user)
            dispatch({ type: 'REMOVE_ALL_SHOT_SELECTION' })
        }
        else {
            return null
        }
    }

    useEffect(() => {
    }, [state.goodImages, state.selectableVideos])

    const deleteOneVideo = (userId, videoId, token) => {
        deleteOneVideoAndShots(userId, videoId, token).then(
            response => {
                setDeleteInfo(response.data);
                setDeleteStatus(response.status);
                setUpdateAfterDelete(!updateAfterDelete)
                dispatch({ type: "UPDATE_GLOBAL_STATE_BOOL" });
            }
        ).catch((error) => {
            console.error(error)
            setDeleteInfo("An error occured!");
            setDeleteStatus(500);
        })
        setShowDeleteInfo(true)
    }

    const handleRefreshPage = () => {
        dispatch({ type: "UPDATE_GLOBAL_STATE_BOOL" });
    }


    useEffect(() => {
        getApiStatus().then(
            response => {
                setServerStatus(response.status);
            }
        ).catch(
            (error) => {
                setServerStatus(500);
            }
        )
        getVideos(user).then(
            (response) => {
                if (response.data.length > 0) {
                    dispatch({ type: 'SET_SELECTABLE_VIDEOS', payload: response.data })
                    dispatch({ type: 'SET_SELECTED_VIDEO', payload: response.data[0] })
                }
            }
        ).catch(
            (error) => {
                console.error(error);
            }
        )
    }, [user, dispatch, updateAfterDelete, state.loading])

    const availableVideos = () => {
        var listOfVideos = state.selectableVideos.map((item) => {
            var logoStyle = { paddingRight: 10 }
            var deleteStyle = { paddingLeft: 10 }
            var statusSymbol

            switch (item.process_status) {
                case ('finished'):
                    statusSymbol = <DoneIcon fontSize='small' style={logoStyle} />
                    break
                case ('waiting'):
                    statusSymbol = <HourglassEmptyIcon fontSize='small' style={logoStyle} />
                    break
                case ('in-process'):
                    statusSymbol = statusSymbol = <div style={logoStyle}><CircularProgress size={20} color='secondary'></CircularProgress></div>
                    break
                default:
                    break

            }

            return <MenuItem
                key={item.video_name}
                onClick={() => dispatch({ type: 'SET_SELECTED_VIDEO', payload: item })}>
                {statusSymbol}{item.video_name}
                <IconButton onClick={() => { deleteOneVideo(user, item.video_name, token) }}>
                    <DeleteIcon fontSize='small' style={{ deleteStyle }}></DeleteIcon>
                </IconButton>
            </MenuItem>
        })

        return (listOfVideos)
    }

    return (
        <div className={classes.root}>
            <VideoModalGoodShots
                token={token}
                open={showShopping}
                handleClose={() => setShowShopping(false)}
                onCloseButton={() => { setShowShopping(false) }}></VideoModalGoodShots>
            <VideoModalBadShots
                token={token}
                open={showBadImages}
                handleClose={() => setShowBadImages(false)}
                onCloseButton={() => { setShowBadImages(false) }}></VideoModalBadShots>
            <AppBar position="static">
                <Toolbar className={classes.toolBar}>
                    <Box className={classes.leftToolBarObject}>
                        <IconButton aria-label="logout" color="secondary" style={{ color: "white" }} onClick={handleClick}>
                            <ExitToAppIcon />
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem key={"logout"} onClick={() => { onClickLogout(); handleClose() }}>Logout</MenuItem>
                            <MenuItem key={"switch"} onClick={() => { handleClose(); onSwitchApplication() }}>Switch Application</MenuItem>
                        </Menu>
                        <Box className={classes.title}>
                            MTC Aesthetify {process.env.DATA_URL}
                            <Box className={classes.serverStatus}>
                                <Typography style={{ textAlign: 'center', textJustify: 'center' }}>Server Status: {serverStatus}</Typography>
                                <Box
                                    marginLeft={1}
                                    border={2}
                                    borderColor={serverStatus === 200 ? 'white' : 'white'}
                                    width={10}
                                    height={10}
                                    borderRadius={10}
                                    bgcolor={serverStatus === 200 ? '#7cd992' : '#ff0033'}></Box>
                            </Box>
                        </Box>
                        <Box style={{
                            flexDirection: 'row',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <Box style={{ marginLeft: 20 }}>
                                <Tooltip title="Refresh page">
                                    <IconButton onClick={handleRefreshPage}>
                                        <RefreshIcon style={{ color: "white" }} ></RefreshIcon>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                    <Box style={{
                        flexDirection: 'row',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Box>
                            <Tooltip title='Select the video' style={{ maxWidth: 100 }}>
                                <IconButton onClick={(event) => { setAnchorVideoList(event.currentTarget) }}>
                                    <VideoLibraryIcon style={{ color: "white", fontSize: 30 }}></VideoLibraryIcon>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                id="video-manu"
                                anchorEl={anchorVideoList}
                                keepMounted
                                open={Boolean(anchorVideoList)}
                                onClose={handleVideoListClose}
                            >
                                {availableVideos()}
                            </Menu>
                            <Tooltip title='Confirm shot selection and reset' style={{ maxWidth: 100 }}>
                                <IconButton onClick={() => resetAndSendImageSelection(token)}>
                                    <RotateLeftIcon style={{ color: "white", fontSize: 30 }}></RotateLeftIcon>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Show liked images'>
                                <IconButton onClick={() => setShowShopping(true)}>
                                    <Badge badgeContent={state.goodShots.length} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} color="secondary">
                                        <ThumbUpIcon style={{ color: "white" }} ></ThumbUpIcon>
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box style={{ marginRight: 40 }}>
                            <Tooltip title="Show disliked images">
                                <IconButton onClick={() => setShowBadImages(true)}>
                                    <Badge badgeContent={state.badShots.length} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} color="secondary">
                                        <ThumbDownIcon style={{ color: "white" }} ></ThumbDownIcon>
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box>
                            <AccountCircleIcon />
                            <Typography variant="body1">{user}</Typography>
                        </Box>
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

VideoTopBar.propTypes = {
    props: PropTypes.any,
    user: PropTypes.string,
    onClickLogout: PropTypes.func,
    onClickShoppingCart: PropTypes.func,
    onSwitchApplication: PropTypes.func
}