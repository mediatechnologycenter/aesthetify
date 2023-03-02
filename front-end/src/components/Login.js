/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles';
import Firebase from '../firebase';
import logo from '../static-media/mtc-logo.png';
import background3 from '../static-media/background_3.png';

const useStyles = makeStyles((theme) => ({
    container: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        backgroundImage: `url(${background3})`,
        backgroundSize: 'cover'
    },
    form: {
        margin: theme.spacing(2),

    },
    formBody: {
        padding: theme.spacing(1),
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 800,
        minWidth: 400,
    }
}));

function LoginTab() {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [, setErrorMessage] = useState();

    function handleLogin() {
        Firebase.auth.signInWithEmailAndPassword(email, password)
            .then((user) => { console.log("the user was logged in", user) })
            .catch(error => { alert(error); setErrorMessage(error) })
    }

    return (
        <div className={classes.container}>
            <div className={classes.formBody}>
                <img src={logo} alt={"logo_mtc"} style={{ width: 250, margin: 10 }}></img>
                <div className={classes.form}>
                    <Grid container spacing={4} alignItems="flex-end">
                        <Grid item>
                            <Face />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField
                                id="username"
                                label="Email"
                                type="email"
                                fullWidth
                                autoFocus
                                required
                                onChange={(e) => { setEmail(e.target.value) }} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={4} alignItems="flex-end">
                        <Grid item>
                            <Fingerprint />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                fullWidth
                                required
                                onChange={(e) => setPassword(e.target.value)} />
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" justify="space-between">
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ textTransform: "none", marginTop: "2em" }}
                            onClick={handleLogin}>Login</Button>
                    </Grid>
                </div>
            </div>
        </div>
    );
}

export default LoginTab;