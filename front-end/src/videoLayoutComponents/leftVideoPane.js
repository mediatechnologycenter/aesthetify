/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Box } from '@material-ui/core';
import VideoQueryBar from '../videoComponents/VideoQueryBar';
import { useStylesLeftPane } from './Styles';


export default function LeftVideoPane(props) {
    const { user, token } = props;
    const classes = useStylesLeftPane();
    return (
        <Paper variant="outlined" className={classes.leftPane}>
            <Box
                className={classes.text}>
                Search Bar
            </Box>
            <VideoQueryBar user={user} token={token}></VideoQueryBar>
        </Paper >
    )
}