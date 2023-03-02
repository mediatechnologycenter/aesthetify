/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Chip, FormControlLabel, Switch, Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { CirclePicker } from 'react-color';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ClearIcon from '@material-ui/icons/Clear';
import CropLandscapeIcon from '@material-ui/icons/CropLandscape';
import CropPortraitIcon from '@material-ui/icons/CropPortrait';
import DeleteIcon from '@material-ui/icons/Delete';
import FaceIcon from '@material-ui/icons/Face';
import NaturePeopleIcon from '@material-ui/icons/NaturePeople';
import Tooltip from '@material-ui/core/Tooltip';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import { Context } from '../utils/Store';
import { useStylesQueryBar } from './Styles';
var qs = require('qs');
const axios = require('axios');

export default function QueryBar(props) {
    const { user, token } = props;
    const classes = useStylesQueryBar();
    const [value,] = React.useState([0, 100]);
    const [state, dispatch] = useContext(Context);
    const [personCount, setPersonCount] = useState(0);
    const [orientation, setOrientation] = useState('');
    const [checked, setChecked] = React.useState([
        { id: 0, feature: "neutral", active: false },
        { id: 1, feature: "happy", active: false },
        { id: 2, feature: "surprise", active: false },
        { id: 3, feature: "sad", active: false },
        { id: 4, feature: "angry", active: false },
        { id: 5, feature: "fear", active: false },
        { id: 6, feature: "disgust", active: false },
    ]);
    const [sortedByAesthetics, setSortedByAesthetics] = useState(false)
    const [color, setColor] = useState('')
    const [pickerColors, setPickerColors] = useState([])
    const [, setTimeStamps] = useState([])
    const [selectedTimeStamps, setSelectedTimeStamps] = useState([])
    const [clustering, setClustering] = useState(false)
    const [shotScale, setShotScale] = useState("")

    function resetAllQueryParams() {
        setSortedByAesthetics(false);
        setClustering(false);
        setOrientation('');
        setShotScale('');
        setChecked([
            { id: 0, feature: "neutral", active: false },
            { id: 1, feature: "happy", active: false },
            { id: 2, feature: "surprise", active: false },
            { id: 3, feature: "sad", active: false },
            { id: 4, feature: "angry", active: false },
            { id: 5, feature: "fear", active: false },
            { id: 6, feature: "disgust", active: false },
        ]);
        setPersonCount(0);
        setColor('');
        setSelectedTimeStamps([]);

    }

    useEffect(() => {
        if (token) {
            sendQueryRequest();
        }
        // eslint-disable-next-line
    }, [token, sortedByAesthetics, checked, personCount, orientation, color, selectedTimeStamps, clustering, shotScale, state.loading])

    const handleEmotionChange = (event) => {
        const checkedTemp = checked
        checkedTemp[event.id].active = !checked[event.id].active
        setChecked([...checkedTemp])
    }

    const handleColorChangeComplete = (color, event) => {
        setColor(color.hex)
    }

    const handleShotScaletChange = (newValue) => {
        // if the shotScale vlaue is the same (click again on the same button), deactivate filter
        setShotScale(newValue === shotScale ? "" : newValue);
    };

    function sendQueryRequest() {

        var aestMin = value[0] / 10
        var aestMax = value[1] / 10
        var emotionList = []
        for (const [, value] of Object.entries(checked)) {
            if (value.active === true) {
                emotionList.push(value.feature)
            }
        }

        var params = {
            //     aestMin: aestMin,
            //     aestMax: aestMax,
            //     sortBy: sortBy,
            //     sortDirection: sortDirection,
            sortedByAesthetics: sortedByAesthetics,
            emotions: emotionList,
            numberOfPeople: personCount,
            //     userId: user,
            imageOrientation: orientation,
            color: color,
            //     selectedTimeStamps: selectedTimeStamps,
            clustering: clustering,
            shotScale: shotScale

        }
        // var params = {"userId": user}
        // console.log("Query parameters", params)
        // console.log("Token: ", `Bearer ${token}`)
        axios.get('/api/queryEngine',
            {
                headers: { "Authorization": `Bearer ${token}` },
                params: params, 'paramsSerializer': function (params) {
                    return qs.stringify(params, { arrayFormat: 'repeat' })
                }
            }).then(res => {
                // console.log("Query result", res)
                var reqData = res.data;
                dispatch({ type: "SET_DATA", payload: reqData, queryParams: params });
                if (!pickerColors.length || state.user_queue_size){
                    // TODO: This sets the colors to the ones received for the first time
                    setPickerColors(res.data.queryLimits.selectableColors);
                }
                // setPickerColors(res.data.queryLimits.selectableColors);
                setTimeStamps(res.data.queryLimits.selectableTimestamps);
            }).catch((error) => {
                console.error(error)
            })
    }



    return (
        <Box className={classes.container}>
            <Divider></Divider>
            <Button
                variant="contained"
                style={{ marginBlock: 20 }}
                color="primary"
                key=""
                size="large"
                onClick={() => resetAllQueryParams()}
                endIcon={<DeleteIcon />}>
                Reset all paramaters
            </Button>
            <Divider></Divider>
            <Box className={classes.titleText}>Aesthetics</Box>

            <FormControlLabel
                control={
                    <Switch
                        checked={sortedByAesthetics}
                        onChange={() => setSortedByAesthetics(!sortedByAesthetics)}
                        name="Aesthetify"
                        color="primary"
                    />
                }
                label="Aesthetify"
            />
            <Divider className={classes.divider}></Divider>
            <Box className={classes.titleText}>Shot Scale</Box>
            <Box className={classes.element}>
                <IconButton
                    onClick={() => handleShotScaletChange("Extreme Close-up Shot")}
                    style={{ backgroundColor: shotScale === "Extreme Close-up Shot" ? "rgba(255, 0, 0, 0.2)" : null }}>
                    <Tooltip title="Extreme Close-up Shot" arrow>
                        <FaceIcon color='primary'></FaceIcon>
                    </Tooltip>
                </IconButton>
                <IconButton
                    onClick={() => handleShotScaletChange("Close-up Shot")}
                    style={{ backgroundColor: shotScale === "Close-up Shot" ? "rgba(255, 0, 0, 0.2)" : null }}>
                    <Tooltip title="Close-up Shot" arrow>
                        <AccountBoxIcon color='primary'></AccountBoxIcon>
                    </Tooltip>
                </IconButton>
                <IconButton
                    onClick={() => handleShotScaletChange("Medium Shot")}
                    style={{ backgroundColor: shotScale === "Medium Shot" ? "rgba(255, 0, 0, 0.2)" : null }}>
                    <Tooltip title="Medium Shot" arrow>
                        <PersonIcon color='primary'></PersonIcon>
                    </Tooltip>
                </IconButton>
                <IconButton
                    onClick={() => handleShotScaletChange("Full Shot")}
                    style={{ backgroundColor: shotScale === "Full Shot" ? "rgba(255, 0, 0, 0.2)" : null }}>
                    <Tooltip title="Full Shot" arrow>
                        <EmojiPeopleIcon color='primary'></EmojiPeopleIcon>
                    </Tooltip>
                </IconButton>
                <IconButton
                    onClick={() => handleShotScaletChange("Long Shot")}
                    style={{ backgroundColor: shotScale === "Long Shot" ? "rgba(255, 0, 0, 0.2)" : null }}>
                    <Tooltip title="Long Shot" arrow>
                        <NaturePeopleIcon color='primary'></NaturePeopleIcon>
                    </Tooltip>
                </IconButton>
            </Box>
            {/* <Divider className={classes.divider}></Divider>
            <Box className={classes.titleText}>Clusters</Box>
            <Button variant="contained" color="primary" size="large" onClick={() => setClustering(!clustering)}>
                Build clusters
            </Button>
            <IconButton onClick={() => setClustering(false)} style={{ marginLeft: 10 }}>
                <ClearIcon color='primary' style={{ paddingRight: 5 }}></ClearIcon>
                <Typography>{`Clear`}</Typography>
            </IconButton> */}

            <Divider className={classes.divider}></Divider>
            <Box className={classes.titleText}>Orientation</Box>
            <IconButton
                onClick={() => setOrientation('landscape' === orientation ? "" : 'landscape')}
                style={{ marginRight: 20, backgroundColor: orientation === 1 ? "rgba(255, 0, 0, 0.2)" : null }}>
                <CropLandscapeIcon color='primary'></CropLandscapeIcon>
            </IconButton>
            <IconButton
                onClick={() => setOrientation('portrait' === orientation ? "" : 'portrait')}
                style={{ backgroundColor: orientation === 0 ? "rgba(255, 0, 0, 0.2)" : null }}>
                <CropPortraitIcon color='primary'></CropPortraitIcon>
            </IconButton>

            <Divider className={classes.divider}></Divider>
            <Box className={classes.titleText}>Emotion Detection</Box>
            {
                checked.map((value, index) => {
                    return (

                        <Chip
                            color="primary"
                            label={value.feature}
                            clickable
                            key={index}
                            className={classes.chips}
                            onClick={() => handleEmotionChange(value)}
                            style={{ backgroundColor: !value.active ? "" : "#8b0000" }} />
                    )
                })
            }
            <Divider className={classes.divider}></Divider>
            <Box className={classes.titleText}>Number of detected faces</Box>
            <IconButton onClick={() => setPersonCount(1 === personCount ? 0 : 1)} style={{ backgroundColor: personCount === 1 ? "rgba(255, 0, 0, 0.2)" : null }}>
                <PersonIcon color='primary' style={{ paddingRight: 5 }}></PersonIcon>
                <Typography>1</Typography>
            </IconButton>
            <IconButton onClick={() => setPersonCount(2 === personCount ? 0 : 2)} style={{ backgroundColor: personCount === 2 ? "rgba(255, 0, 0, 0.2)" : null }}>
                <PeopleIcon color='primary' style={{ paddingRight: 5 }}></PeopleIcon>
                <Typography>{` 2`}</Typography>
            </IconButton>
            <IconButton onClick={() => setPersonCount(3 === personCount ? 0 : 3)} style={{ backgroundColor: personCount === 3 ? "rgba(255, 0, 0, 0.2)" : null }}>
                <GroupAddIcon color='primary' style={{ paddingRight: 5 }}></GroupAddIcon>
                <Typography>{` 3+`}</Typography>
            </IconButton>
            <Divider className={classes.divider}></Divider>
            <Box className={classes.titleText}>Color Selection</Box>
            <Box style={{ alignItems: 'center', justifyContent: 'center' }}>
                <CirclePicker
                    width="100%"
                    circleSpacing={18}
                    onChangeComplete={handleColorChangeComplete}
                    colors={pickerColors}></CirclePicker>
            </Box>
            <IconButton onClick={() => setColor('')} style={{}}>
                <ClearIcon color='primary' style={{ paddingRight: 5 }}></ClearIcon>
                <Typography>{`Clear`}</Typography>
            </IconButton>
        </Box >


    )
}
