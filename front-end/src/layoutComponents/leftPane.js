/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Box } from '@material-ui/core';
import QueryBar from '../components/QueryBar';



const useStyles = makeStyles((theme) => ({
    leftPane: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(1),
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontWeight: 500,
        fontSize: 30,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginY: 1,
        paddingBottom: theme.spacing(1),
    }
}));

export default function LeftPane(props) {
    const { user, token } = props;
    const classes = useStyles();
    return (
        <Paper variant="outlined" className={classes.leftPane}>
            <Box
                className={classes.text}>
                Search Bar
            </Box>
            <QueryBar user={user} token={token}></QueryBar>
        </Paper >
    )
}