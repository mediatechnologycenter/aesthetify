/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import { makeStyles } from '@material-ui/core/styles';

const useStylesImageGallery = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 400,
        height: 200,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    images: {
    },
    previewImage: {
        width: '100%',
        maxWidth: 360,
    },
    slider: {
        width: "70%",
        flex: 1,
    },
    titleTextOptions: {
        fontWeight: 500,
        fontSize: 20,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingBlock: theme.spacing(2),
    },
    titleText: {
        fontWeight: 500,
        fontSize: 24,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingBlock: theme.spacing(2),
    },
}));

const useStylesQueryBar = makeStyles((theme) => ({
    container: {
        alignItems: 'center',
        alignContent: 'center'
    },
    slider: {
        width: "70%",
        padding: theme.spacing(1),
        marginTop: theme.spacing(6)
    },
    searchText: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
    chips: {
        margin: theme.spacing(0.5),
        marginInline: theme.spacing(1),
    },
    titleText: {
        fontWeight: 500,
        fontSize: 24,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingBlock: theme.spacing(2),
    },
    divider: {
        marginBlock: theme.spacing(2),
    },

}));

const useStylesVideoPreview = makeStyles((theme) => ({
    root: {
        position: 'relative',
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageContainer: {
        display: 'flex',
        flex: 1,
        width: '100%',
        position: 'relative',
        maxHeight: 400,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: 30,
    },
    previewContainer: {
        width: '80%',
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        // border: '2px solid grey',
        borderRadius: 20,
        padding: 10

    },
    titleTextOptions: {
        fontWeight: 500,
        fontSize: 24,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingBlock: theme.spacing(2),
    },

}));

const useStylesVideoModal = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        height: '80%',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export { useStylesImageGallery, useStylesQueryBar, useStylesVideoPreview, useStylesVideoModal }