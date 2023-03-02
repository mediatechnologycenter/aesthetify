/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

const downloadTxtFile = (value, selection_type, token) => {
    const element = document.createElement("a");
    const beautifiedTxtFile = value.map((el) => {
        return el.image_id
    })
    const file = new Blob([JSON.stringify(beautifiedTxtFile)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selection_type}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

export { downloadTxtFile }