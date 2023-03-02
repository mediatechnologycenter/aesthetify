/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React, { useEffect, useState } from 'react';
import TopBar from './components/TopBar';
import LeftPane from './layoutComponents/leftPane';
import MiddlePane from './layoutComponents/middlePane';
import LeftVideoPane from './videoLayoutComponents/leftVideoPane';
import MiddleVideoPane from './videoLayoutComponents/middleVideoPane';
import Login from './components/Login';
import VideoOrImage from './components/VideoOrImage';
import Loading from './components/Loading';
import VideoTopBar from './videoComponents/VideoTopBar';
import Store from './utils/Store';
import Firebase from './firebase';
import { ThemeProvider } from '@material-ui/core/styles';
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import './App.css';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#fd2e58",
    },
    secondary: {
      main: "#CC3358",
    },
  },
});

function App() {
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');
  const [image, setImage] = useState(true); // TODO: This forces image backend by default
  const [video, setVideo] = useState(false);

  useEffect(() => {
    Firebase.init();
    Firebase.auth.onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken(true).then(function (idToken) {
          setToken(idToken);
        });
        setUser(user)
      } else {
        setUser(null)
      }
    })
  }, [])

  function handleLogout() {
    Firebase.auth.signOut()
  }

  return (

    <Store>
      <div className="App">
        <ThemeProvider theme={theme}>
          {user === ''
            ?
            <Loading></Loading>
            :
            <>
              {!user || !token
                ?
                <Login></Login>
                :
                <>
                  {(!image && !video)
                    ?
                    <VideoOrImage onClickImage={() => setImage(true)} onClickVideo={() => setVideo(true)}></VideoOrImage>
                    :
                    <>
                      {image ?
                        <>
                          <TopBar user={user.email} token={token} onClickLogout={handleLogout} onSwitchApplication={() => setImage(false)}></TopBar>
                          <Grid container>
                            <Grid item xs={3}>
                              <LeftPane user={user.email} token={token}></LeftPane>
                            </Grid>
                            <Grid item xs={9}>
                              <MiddlePane user={user.email} token={token} video={false}></MiddlePane>
                            </Grid>
                          </Grid>
                        </>
                        :
                        <>
                          <VideoTopBar user={user.email} token={token} onClickLogout={handleLogout} onSwitchApplication={() => setVideo(false)}></VideoTopBar>
                          <Grid container justifyContent='center'>
                            <Grid item xs={3}>
                              <LeftVideoPane user={user.email} token={token}></LeftVideoPane>
                            </Grid>
                            <Grid item xs={9}>
                              <MiddleVideoPane user={user.email} token={token} video={true}></MiddleVideoPane>
                            </Grid>
                          </Grid>
                        </>}
                    </>
                  }
                </>
              }</>}
        </ThemeProvider>
      </div >
    </Store>
  );
}

export default App;
