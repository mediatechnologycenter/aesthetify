/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
import React from 'react';
import ImageGallery from '../components/ImageGallery';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2),
        marginInline: theme.spacing(2),
        marginTop: theme.spacing(2),
    }
}));

export default function MiddleVideoPane(props) {
    const { user, token, video } = props;
    const classes = useStyles();

    return (
        <div className="App">
            <Paper variant="outlined" className={classes.root}>
                <ImageGallery user={user} token={token} video={video}></ImageGallery>
            </Paper>
        </div>
    );
}
