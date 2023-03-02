/*
 * *  SPDX-License-Identifier: Apache-2.0
 * *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details
 */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://backend:5000',
            changeOrigin: true
        })
    );
    // app.use(
    //     '/video-api',
    //     createProxyMiddleware({
    //         target: 'http://video-api:5001',
    //         changeOrigin: true,
    //         limit: '2000mb'
    //     })
    // )
};