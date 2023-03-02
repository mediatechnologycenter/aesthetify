/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React, { useState, useEffect, useContext, Fragment, ImageSource } from 'react';
import { Context } from '../utils/Store';
import JustifiedGrid from 'react-justified-grid';
import Slider from '@material-ui/core/Slider';
import UploadFiles from './UploadFiles';
import ImagePreview from './subComponents/ImagePreview';
import { Box, Divider } from '@material-ui/core';
import globalVariables from '../utils/GlobalVariables';
import { useStylesImageGallery } from './Styles';
import Grid from '@material-ui/core/Grid';
/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling


function ImageGallery(props) {
    const { user, token } = props;
    const [images, setImages] = useState([]);
    const [clusteredImages, setClusteredImages] = useState([]);
    const classes = useStylesImageGallery();
    const [state,] = useContext(Context);
    const [rows,] = useState(1000); // TODO: This variable controls how many images are displayed, depending on image height
    const [galleryHeight, setGalleryHeight] = useState(300);
    const [showImage, setShowImage] = useState(false);
    const [selectedImageData, setSelectedImageData] = useState({
        src: "",
        originalData: {},
        key: 0
    });
    const [clusteringActive, setClusteringActive] = useState(false)

    useEffect(() => {
        console.log(state.data)
        setImages(state.data);
        setClusteredImages(state.clusteredData);
        setClusteringActive(state.queryParams.clustering);
    }, [state]);

    const handleMaxHeight = (event, newValue) => {
        setGalleryHeight(newValue)
    }
    function valuetext(value) {
        return `${value}`;
    }

    // function fetchWithAuthentication(url, authToken) {
    //     axios.get(url,
    //         {
    //             headers: { "Authorization": `Bearer ${authToken}` },
    //             responseType: "arraybuffer"
    //         }).then(response => {
    //             return response
    //         }).catch((error) => {
    //             console.error(error)
    //         })
    //   }

    function fetchWithAuthentication(url, authToken) {
        const headers = new Headers();
        headers.set('Authorization', `Bearer ${authToken}`);
        return fetch(url, { headers });
    }

    function displayProtectedImage(
        imageId, imageUrl, authToken, height, width, originalData
    ) {
        console.log("token ", authToken)
        // Fetch the image.
        const response = fetchWithAuthentication(
            imageUrl, authToken
        );

        // Create an object URL from the data.
        const blob = response.blob;
        const objectUrl = URL.createObjectURL(blob);

        // Update the source of the image.
        // const imageElement = getElementById(imageId);
        // imageElement.src = objectUrl;
        // imageElement.onload = () => URL.revokeObjectUrl(objectUrl);
        return <img
            src={objectUrl}
            alt={imageUrl}
            height={height}
            width={width}
            key={imageUrl}
            style={{ padding: 3 }}
            onClick={() => {
                setSelectedImageData({
                    src: imageUrl,
                    originalData: originalData,
                }); setShowImage(true)
            }} />
    }
    return (
        <div style={{ flex: 1 }}>
            <Grid id="top-row" justifyContent="center" container >
                <Grid item xs={6}>
                    {<UploadFiles user={user} token={token}></UploadFiles>}
                </Grid>
                <Grid item xs={6}>
                    <Box className={classes.titleTextOptions}>Image Height</Box>
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
                    showImage ? <ImagePreview
                        onClick={() => setShowImage(false)}
                        images={images}
                        token={token}
                        data={selectedImageData.originalData}
                        src={`/api/image-server/image?userId=${selectedImageData.originalData.user_id}&size=original&image_id=${selectedImageData.originalData.image_id}`}
                        imageKey={selectedImageData.key}
                        showImage={showImage}
                        onClickClusterImage={(eventObject) => { setSelectedImageData(eventObject) }}></ImagePreview> : null
                }
                <JustifiedGrid images={clusteringActive ? clusteredImages : images} rows={rows} maxRowHeight={galleryHeight} showIncompleteRow>
                    {processedImages => {
                        return (
                            <Fragment key={processedImages}>
                                {processedImages.map((image, key) => {
                                    const { width, height, originalData } = image;
                                    var userId = originalData.user_id;
                                    var image_id = originalData.image_id
                                    var padding = 3;
                                    var imageWidth = width - (padding * 2);
                                    var imageHeight = height - (padding * 2);
                                    var imagesrc;
                                    try {
                                        if (process.env.REACT_APP_THUMBNAIL_ACTIVE) {
                                            imagesrc = `/api/image-server/image?userId=${originalData.user_id}&size=thumbnail&image_id=${image_id}`
                                        }
                                        else {
                                            imagesrc = `/api/image-server/image?userId=${originalData.userId}&size=original&image_id=${image_id}`
                                        }
                                    }
                                    catch {
                                        imagesrc = `${globalVariables.missingImageUrl}`
                                    }
                                    return (
                                        <img
                                            src={imagesrc}
                                            alt={imagesrc}
                                            height={height}
                                            width={width}
                                            key={key}
                                            style={{ padding: padding }}
                                            onClick={() => {
                                                setSelectedImageData({
                                                    src: imagesrc,
                                                    originalData: originalData,
                                                }); setShowImage(true)
                                            }} />
                                        // displayProtectedImage(image_id, imagesrc, token, height, width, originalData)
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


export default ImageGallery