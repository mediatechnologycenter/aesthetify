/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
import React from 'react';
import VideoGallery from '../videoComponents/VideoGallery.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useStylesMiddlePane } from './Styles.js';

export default function MiddleVideoPane(props) {
    const { user, token, video } = props;
    const classes = useStylesMiddlePane();

    return (
        <div className="App">
            <Paper variant="outlined" className={classes.root}>
                <Grid container justifyContent="center">
                    <VideoGallery user={user} token={token} video={video}></VideoGallery>
                </Grid>
            </Paper>
        </div>
    );
}
