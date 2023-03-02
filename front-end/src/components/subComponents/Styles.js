/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import { makeStyles } from '@material-ui/core/styles';

const useStylesClusterPreview = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    imageContainer: {
        transition: 'opacity 300ms ease',
        '&:hover': {
            opacity: 0.9
        },
        '&:active': {
            opacity: 0.7
        }
    }
}));

const useStylesImageGarbageModal = makeStyles((theme) => ({
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

const useStylesImagePreview = makeStyles((theme) => ({
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

const useStylesImageShoppingModal = makeStyles((theme) => ({
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

export { useStylesClusterPreview, useStylesImageGarbageModal, useStylesImagePreview, useStylesImageShoppingModal }