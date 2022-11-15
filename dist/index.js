"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsRedirect = exports.awsFederatedLogin = void 0;
var windowSize = {
    width: 600,
    height: 678
};
var parseObjectToUrlParam = function (obj, ignoreFields) {
    return Object.keys(obj)
        .filter(function (key) { return ignoreFields.indexOf(key) === -1; })
        .map(function (key) { return key + '=' + encodeURIComponent(obj[key]); })
        .join('&');
};
var awsFederatedLogin = function (loginParams) {
    var awsAuthorizedUrl = loginParams.awsAuthorizedUrl, mode = loginParams.mode, callback = loginParams.callback;
    var query = parseObjectToUrlParam(loginParams, ['awsAuthorizedUrl', 'mode', 'callback']);
    var href = "".concat(awsAuthorizedUrl, "?").concat(query);
    if (typeof window !== 'undefined') {
        if (mode === 'popup') {
            var left = window.screen.width / 2 - windowSize.width / 2;
            var top_1 = window.screen.height / 2 - windowSize.height / 2;
            // ,location=yes,scrollbars=yes,status=yes
            window.open(href, 'sub', "width=".concat(windowSize.width, ",height=").concat(windowSize.height, ",left=").concat(left, ",top=").concat(top_1));
        }
        else {
            window.open(href, '_blank');
        }
        window.addEventListener('message', function (event) {
            var _a;
            var newCode = (_a = event.data) === null || _a === void 0 ? void 0 : _a.code;
            if (newCode && newCode !== sessionStorage.getItem('code') && callback) {
                sessionStorage.setItem('code', newCode);
                callback(event.data);
            }
        });
    }
};
exports.awsFederatedLogin = awsFederatedLogin;
var awsRedirect = function () {
    // const _redirectURL = (location.hostname === 'localhost' ? 'http://' : 'https://') + location.host
    var search = location.search.substring(1);
    var searchObj = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    if (window === null || window === void 0 ? void 0 : window.opener) {
        window.opener.postMessage(searchObj, '*');
        window.close();
    }
};
exports.awsRedirect = awsRedirect;
