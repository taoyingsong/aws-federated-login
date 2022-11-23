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
var _eventHandlers = {};
var addListener = function (node, event, handler, capture) {
    if (capture === void 0) { capture = false; }
    if (Object.keys(_eventHandlers).indexOf(event) === -1) {
        _eventHandlers[event] = [];
    }
    // here we track the events and their nodes (note that we cannot
    // use node as Object keys, as they'd get coerced into a string
    _eventHandlers[event].push({ node: node, handler: handler, capture: capture });
    node.addEventListener(event, handler, capture);
};
var removeAllListeners = function (targetNode, event) {
    var _eventArr = _eventHandlers[event];
    if (_eventArr && _eventArr.length > 0) {
        // remove listeners from the matching nodes
        _eventArr
            .filter(function (_a) {
            var node = _a.node;
            return node === targetNode;
        })
            .forEach(function (_a) {
            var node = _a.node, handler = _a.handler, capture = _a.capture;
            return node.removeEventListener(event, handler, capture);
        });
        // update _eventHandlers global
        _eventHandlers[event] = _eventArr.filter(function (_a) {
            var node = _a.node;
            return node !== targetNode;
        });
    }
};
var awsFederatedLogin = function (loginParams) {
    var awsAuthorizedUrl = loginParams.awsAuthorizedUrl, mode = loginParams.mode, callback = loginParams.callback;
    var query = parseObjectToUrlParam(loginParams, ['awsAuthorizedUrl', 'mode', 'callback']);
    var href = "".concat(awsAuthorizedUrl, "?").concat(query);
    var _fn = function (event) {
        var _a;
        var newCode = (_a = event.data) === null || _a === void 0 ? void 0 : _a.code;
        if (newCode && newCode !== sessionStorage.getItem('code') && callback) {
            sessionStorage.setItem('code', newCode);
            callback(event.data);
            window.removeEventListener('message', _fn, false);
        }
    };
    if (typeof window !== 'undefined') {
        removeAllListeners(window, 'message');
        if (mode === 'popup') {
            var left = window.screen.width / 2 - windowSize.width / 2;
            var top_1 = window.screen.height / 2 - windowSize.height / 2;
            // ,location=yes,scrollbars=yes,status=yes
            window.open(href, 'sub', "width=".concat(windowSize.width, ",height=").concat(windowSize.height, ",left=").concat(left, ",top=").concat(top_1));
        }
        else {
            window.open(href, '_blank');
        }
        addListener(window, 'message', _fn);
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
