/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Context } from '../utils/Store';
import JustifiedGrid from 'react-justified-grid';
import Slider from '@material-ui/core/Slider';
import VideoPreview from './VideoPreview';
import { Box, Divider } from '@material-ui/core';
import globalVariables from '../utils/GlobalVariables';
import { useStylesImageGallery } from './Styles';
import UploadVideoSection from './uploadVideoSection';
import Grid from '@material-ui/core/Grid';
/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling


export default function VideoGallery(props) {
    const { user, token } = props;
    const [videos, setVideos] = useState([]);
    const classes = useStylesImageGallery();
    const [state,] = useContext(Context);
    const [rows,] = useState(10);
    const [galleryHeight, setGalleryHeight] = useState(300);
    const [showImage, setShowImage] = useState(false);
    const [selectedVideoData, setSelectedVideoData] = useState({
        src: "",
        originalData: {},
        key: 0
    });

    useEffect(() => {
        if (typeof state.videoData !== "undefined") {
            setVideos(state.videoData);
        }
    }, [state]);

    const handleMaxHeight = (event, newValue) => {
        setGalleryHeight(newValue)
    }
    function valuetext(value) {
        return `${value}`;
    }

    return (
        <div style={{ flex: 1 }}>
            <Grid id="top-row" container justifyContent="center">
                <Grid item xs={6}>
                    <UploadVideoSection user={user} token={token}></UploadVideoSection>
                </Grid>
                <Grid item xs={6}>
                    <Box className={classes.titleTextOptions}>Shot Height</Box>
                    <Slider
                        className={classes.slider}
                        value={galleryHeight}
                        scale={(x) => x}
                        min={100}
                        max={500}
                        onChange={handleMaxHeight}
                        getAriaValueText={valuetext}
                        step={10}
                        aria-labelledby="continuous-slider"
                        valueLabelDisplay="auto" />

                </Grid>
            </Grid>

            <div style={{ flex: 1 }}>
                <Divider style={{ marginBlock: 20 }}></Divider>
                {
                    showImage ? <VideoPreview
                        onClick={() => setShowImage(false)}
                        width={600}
                        data={selectedVideoData.originalData}
                        src={selectedVideoData.src}
                        imageKey={selectedVideoData.key}
                        showImage={showImage}></VideoPreview> : null
                }
                <JustifiedGrid images={videos} rows={rows} maxRowHeight={galleryHeight} showIncompleteRow>
                    {processedImages => {
                        return (
                            <Fragment key={processedImages}>
                                {processedImages.map((image, key) => {
                                    const { width, height, originalData } = image;
                                    // var imageThumbnail = originalData.thumbnail;
                                    var userId = originalData.user_id;
                                    var imageSrc = originalData.src;
                                    var videoPath = originalData.video_name;
                                    var imageToken = originalData.token;
                                    var padding = 3;
                                    var imageWidth = width - (padding * 2);
                                    var imageHeight = height - (padding * 2);
                                    var imagesrc;
                                    try {
                                        imagesrc = `/video-api/video-server/shot-url?user_id=${userId}&video_name=${videoPath}&token=${imageToken}&src=${imageSrc}`
                                    }
                                    catch {
                                        imagesrc = `${globalVariables.missingImageUrl}`
                                    }
                                    return (
                                        <img
                                            src={imagesrc}
                                            alt={imagesrc}
                                            height={imageHeight}
                                            width={imageWidth}
                                            key={key}
                                            style={{ padding: padding }}
                                            onClick={() => {
                                                setSelectedVideoData({
                                                    src: imagesrc,
                                                    originalData: originalData,
                                                }); setShowImage(true)
                                            }} />
                                    );
                                })}
                            </Fragment>
                        );
                    }}
                </JustifiedGrid>
            </div>
        </div >
    );
}