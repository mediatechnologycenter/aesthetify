/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import React from 'react';
import ReactPlayer from 'react-player';

export default function VideoComponent(props) {
    const { videoUrl, thumbnailUrl } = props

    var returnComponent =
        <ReactPlayer
            url={videoUrl}
            controls={true}
            light={thumbnailUrl}>
        </ReactPlayer>


    return (returnComponent)
}