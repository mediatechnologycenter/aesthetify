/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import { makeStyles } from '@material-ui/core/styles';

const useStylesMiddlePane = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2),
        marginInline: theme.spacing(2),
        marginTop: theme.spacing(2),
    }
}));

const useStylesLeftPane = makeStyles((theme) => ({
    leftPane: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(1),
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontWeight: 500,
        fontSize: 30,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginY: 1,
        paddingBottom: theme.spacing(1),
    }
}));

export { useStylesMiddlePane, useStylesLeftPane }