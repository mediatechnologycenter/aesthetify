/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography, Box } from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
    rightPane: {
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(1)
    },
    rightPaneText: {
        fontWeight: 500,
        fontSize: 30,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    }
}));

export default function RightPane() {
    const classes = useStyles();

    return (
        <Paper variant="outlined" className={classes.rightPane}>
            <Box className={classes.rightPaneText}>
                MTC Aesthetify
                    </Box>
            <Typography variant="h4">Preview</Typography>
        </Paper>
    )
}