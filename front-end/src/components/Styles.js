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

const useStylesTopBar = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    toolBar: {
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    leftToolBarObject: {
        display: 'flex',
        flexDirection: 'row'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        fontWeight: 500,
        fontSize: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingBlock: theme.spacing(1),
    },
    serverStatus: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    serverStatusIcon: {
        marginLeft: 1,
        border: 2,
        width: 10,
        height: 10,
        borderRadius: 10,
    }
}));

export { useStylesImageGallery, useStylesQueryBar, useStylesTopBar }