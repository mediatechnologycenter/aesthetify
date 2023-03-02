/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React from 'react';
import PropTypes from 'prop-types';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import globalVariables from '../../utils/GlobalVariables';
import { useStylesClusterPreview } from './Styles';

export default function ClusterPreview(props) {
    const { images, cluster, onClickClusterImage } = props
    const classes = useStylesClusterPreview();
    var filteredImages = images.filter(obj => {
        return obj.clustering.cluster === cluster
    })
    return <div className={classes.root}>
        <ImageList className={classes.gridList} cols={6}>
            {filteredImages.map((image, key) => {
                var imageSrc = image.src
                var userId = image.userId
                var imageThumbnail = image.thumbnail
                var imageVeriToken = image.token
                var imagesrc
                try {
                    if (process.env.REACT_APP_THUMBNAIL_ACTIVE) {
                        imagesrc = `/api/image-server/image?userId=${userId}&thumbnail=${imageThumbnail}&token=${imageVeriToken}`
                    }
                    else {
                        imagesrc = `/api/image-server/image?userId=${userId}&src=${imageSrc}&token=${imageVeriToken}`
                    }
                }
                catch {
                    imagesrc = `${globalVariables.missingImageUrl}`
                }
                const imageObject = {
                    src: imagesrc,
                    originalData: image,
                }
                return (
                    <ImageListItem key={key} className={classes.imageContainer}>
                        <img
                            src={imagesrc}
                            key={key}
                            alt={imagesrc}
                            width={'100%'}
                            height={'100%'}
                            style={{ objectFit: 'contain' }}
                            onClick={() => onClickClusterImage(imageObject)} />
                    </ImageListItem>
                );
            })}
        </ImageList>
    </div>
}

ClusterPreview.propTypes = {
    props: PropTypes.any,
    images: PropTypes.array,
    cluster: PropTypes.any,
    onClickClusterImage: PropTypes.func,
}