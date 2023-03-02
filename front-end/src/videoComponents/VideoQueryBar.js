/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import FaceIcon from '@material-ui/icons/Face';
import NaturePeopleIcon from '@material-ui/icons/NaturePeople';
import Tooltip from '@material-ui/core/Tooltip';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import PanToolIcon from '@material-ui/icons/PanTool';
import { Context } from '../utils/Store';
import { useStylesQueryBar } from './Styles';
import { getQueryOfShots } from './functions';
import DirectionsRun from '@material-ui/icons/DirectionsRun';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import ArchiveIcon from '@material-ui/icons/Archive';
import Slider from '@material-ui/core/Slider';

export default function VideoQueryBar(props) {
    const { user, token } = props;
    const classes = useStylesQueryBar();
    const [state, dispatch] = useContext(Context);
    const [sortBy,] = useState("aestheticScore");
    const [sortDirection, setSortDirection] = useState(1);
    const [shotScale, setShotScale] = useState("");
    const [motion, setMotion] = useState("");
    const [timeframe, setTimeFrame] = useState([10, 37]);
    const [maxTimeframe, setMaxTimeFrame] = useState(100);
    const [minTimeframe,] = useState(0);
    const [framerate,] = useState(25);

    function resetAllQueryParams() {
        setSortDirection(1);
        setShotScale("");
        setMotion("");
        setTimeFrame([minTimeframe, maxTimeframe]);
    }

    useEffect(() => {
        if (typeof state.selectedVideo !== "undefined" && typeof state.selectedVideo.last_shot_index !== "undefined") {
            setMaxTimeFrame(state.selectedVideo.last_shot_index)
            setTimeFrame([0, state.selectedVideo.last_shot_index])
        }
    }, [state.selectedVideo])


    useEffect(() => {
        sendQueryRequest();
        // eslint-disable-next-line
    }, [sortDirection, sortBy, motion, shotScale, timeframe, state.selectedVideo])

    function sendQueryRequest() {
        var params = {
            user_id: user,
            video_name: String(state.selectedVideo.video_name),
            sortDirection: sortDirection,
            sortBy: sortBy,
            shotScale: shotScale,
            shotMovement: motion,
            startFrame: timeframe[0],
            endFrame: timeframe[1],
        }
        if (typeof state.selectedVideo.video_name !== "undefined") {
            getQueryOfShots(params, token).then(
                response => {
                    dispatch({ type: "SET_VIDEO_DATA", payload: response.data })
                }
            ).catch(error => { console.error(error) })
        }
    }

    const handleChange = (event, newValue) => {
        setTimeFrame(newValue);
    };


    function valueLabelFormat(value) {
        let scale = ["s", "m", "h"]
        let valueInSeconds = Math.round(value / framerate)
        let valueInMinutes = Math.round(value / (framerate * 60))
        let returnValue = valueInSeconds
        let scaleSign = scale[0]
        if (valueInSeconds > 120) {
            returnValue = valueInMinutes
            scaleSign = scale[1]
        }

        return `${returnValue} ${scaleSign}`;
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
            <Button variant="contained" color="primary" size="large" onClick={() => setSortDirection(-1)}>
                Aesthetify
            </Button>
            <IconButton onClick={() => setSortDirection(2)} style={{ marginLeft: 10 }}>
                <ClearIcon color='primary' style={{ paddingRight: 5 }}></ClearIcon>
                <Typography>{`Clear`}</Typography>
            </IconButton>
            <Divider className={classes.divider}></Divider>
            <Box className={classes.titleText}>Shot Scale</Box>
            <IconButton
                onClick={() => setShotScale("Extreme Close-up Shot")}
                style={{ backgroundColor: shotScale === "Extreme Close-up Shot" ? "rgba(255, 0, 0, 0.2)" : null }}>
                <Tooltip title="Extreme Close-up Shot" arrow>
                    <FaceIcon color='primary'></FaceIcon>
                </Tooltip>
            </IconButton>
            <IconButton
                onClick={() => setShotScale("Close-up Shot")}
                style={{ backgroundColor: shotScale === "Close-up Shot" ? "rgba(255, 0, 0, 0.2)" : null }}>
                <Tooltip title="Close-up Shot" arrow>
                    <AccountBoxIcon color='primary'></AccountBoxIcon>
                </Tooltip>
            </IconButton>
            <IconButton
                onClick={() => setShotScale("Medium Shot")}
                style={{ backgroundColor: shotScale === "Medium Shot" ? "rgba(255, 0, 0, 0.2)" : null }}>
                <Tooltip title="Medium Shot" arrow>
                    <PersonIcon color='primary'></PersonIcon>
                </Tooltip>
            </IconButton>
            <IconButton
                onClick={() => setShotScale("Full Shot")}
                style={{ backgroundColor: shotScale === "Full Shot" ? "rgba(255, 0, 0, 0.2)" : null }}>
                <Tooltip title="Full Shot" arrow>
                    <EmojiPeopleIcon color='primary'></EmojiPeopleIcon>
                </Tooltip>
            </IconButton>
            <IconButton
                onClick={() => setShotScale("Long Shot")}
                style={{ backgroundColor: shotScale === "Long Shot" ? "rgba(255, 0, 0, 0.2)" : null }}>
                <Tooltip title="Long Shot" arrow>
                    <NaturePeopleIcon color='primary'></NaturePeopleIcon>
                </Tooltip>
            </IconButton>
            <IconButton onClick={() => setShotScale("")}>
                <ClearIcon color='primary' style={{ paddingRight: 5 }}></ClearIcon>
                <Typography>{`Clear`}</Typography>
            </IconButton>
            <Divider className={classes.divider}></Divider>
            <Box className={classes.titleText}>Motion</Box>
            <IconButton
                onClick={() => setMotion("Static")}
                style={{ backgroundColor: motion === "Static" ? "rgba(255, 0, 0, 0.2)" : null }}>
                <Tooltip title="Static" arrow>
                    <PanToolIcon color='primary'></PanToolIcon>
                </Tooltip>
            </IconButton>
            <IconButton
                onClick={() => setMotion("Motion")}
                style={{ backgroundColor: motion === "Motion" ? "rgba(255, 0, 0, 0.2)" : null }}>
                <Tooltip title="Motion" arrow>
                    <DirectionsRun color='primary'></DirectionsRun>
                </Tooltip>
            </IconButton>
            <IconButton
                onClick={() => setMotion("Push")}
                style={{ backgroundColor: motion === "Push" ? "rgba(255, 0, 0, 0.2)" : null }}>
                <Tooltip title="Push" arrow>
                    <DoubleArrowIcon color='primary'></DoubleArrowIcon>
                </Tooltip>
            </IconButton>
            <IconButton
                onClick={() => setMotion("Pull")}
                style={{ backgroundColor: motion === "Pull" ? "rgba(255, 0, 0, 0.2)" : null }}>
                <Tooltip title="Pull" arrow>
                    <ArchiveIcon color='primary'></ArchiveIcon>
                </Tooltip>
            </IconButton>
            <IconButton onClick={() => setMotion("")}>
                <ClearIcon color='primary' style={{ paddingRight: 5 }}></ClearIcon>
                <Typography>{`Clear`}</Typography>
            </IconButton>
            <Divider className={classes.divider}></Divider>
            <Box className={classes.titleText}>Timeframe</Box>
            <Box style={{ marginInline: 30 }}>
                <Slider
                    value={timeframe}
                    onChange={handleChange}
                    step={25}
                    min={minTimeframe}
                    max={maxTimeframe}
                    getAriaValueText={valueLabelFormat}
                    valueLabelFormat={valueLabelFormat}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                />
            </Box>
        </Box >


    )
}