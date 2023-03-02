/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

function getEnvVar(envVarName, defaultValue) {
    let val = window.configs[envVarName];
    if (val){
        return val.toLowerCase();
    } else {
        return defaultValue;
    }
}

export const environment = getEnvVar("REACT_APP_ENVIRONMENT");
