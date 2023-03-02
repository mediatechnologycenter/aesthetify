/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';


export default function Loading() {
    return (
        <Grid container justifyContent='center' alignItems='center' style={{ minHeight: '100vh' }}>
            <CircularProgress />
        </Grid>
    )
}