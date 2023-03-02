/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import {environment} from "./config.js";

const environmentConfigs = {
    "dev": {
        apiKey: 'AIzaSyBn033H95JRoJL1LNHGUXVUMM6cVHZtB8s',
        appId: '1:461990907139:web:b34f70551ca6daeaa8ed36',
        messagingSenderId: '461990907139',
        projectId: 'mtc-dev',
        authDomain: 'mtc-dev.firebaseapp.com',
        storageBucket: 'mtc-dev.appspot.com',
    },
    "prod": {
        apiKey: 'AIzaSyDs-5vDpSPiIH7M7XMl3f-shmzBhgg0wvE',
        appId: '1:176136282412:web:3c277bd4572057deef4c89',
        messagingSenderId: '176136282412',
        projectId: 'mtc-production',
        authDomain: 'mtc-production.firebaseapp.com',
        storageBucket: 'mtc-production.appspot.com',
    }
}

console.log(`Using Firebase credential for REACT_APP_ENVIRONMENT=${environment}`);

export const firebaseConfig = environmentConfigs[environment];
