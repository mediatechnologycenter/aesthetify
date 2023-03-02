/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

import firebase from "firebase/app";
import "firebase/auth";
import { firebaseConfig } from "./firebaseConfig.js";

export default class Firebase {
    static init() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        Firebase.auth = firebase.auth();
    }
}