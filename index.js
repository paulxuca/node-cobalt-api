'use strict';

var request = require('request');
var BASE_URL = 'https://cobalt.qas.im/api/1.0';

function CobaltClient(opts) {
    if (!(this instanceof CobaltClient)) {
        return new CobaltClient(opts);
    }

    if (!opts.API_KEY) {
        throw new Error('An API key must be provided.');
    }

    this.apiKey = opts.API_KEY;
}

CobaltClient.prototype.get = function(path, params, cb) {
    this._makeRequest('get', path, params, cb);
};

CobaltClient.prototype._createEndpoint = function(path, params) {
    var endpoint = BASE_URL + path;

    if (path.indexOf('/search') !== -1 && !params.hasOwnProperty('q')) {
        throw new Error('Search query does not have required parameter "q".');
    }

    if (params.hasOwnProperty('id')) {
        endpoint += '/' + params['id'];
    }

    endpoint += '?key=' + this.apiKey;

    if (Object.keys(params).length > 0) {
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                endpoint += '&' + key + '=' + params[key];
            }
        }
    }

    return endpoint;
};

CobaltClient.prototype._makeRequest = function(method, path, params, cb) {
    if (typeof params === 'function') {
        cb = params;
        params = {};
    }

    var endpoint = this._createEndpoint(path, params);

    request({
        method: method,
        url: endpoint,
    }, function(err, response, data) {
        if (err) {
            cb(err, data, response);
        } else {
            try {
                data = JSON.parse(data);
            } catch (e) {
                cb(
                    new Error('Status Code: ' + response.statusCode),
                    data,
                    response
                );
            }

            if (typeof data.errors !== 'undefined') {
                cb(data.errors, data, response);
            } else if (response.statusCode !== 200) {
                cb(
                    new Error('Status Code: ' + response.statusCode),
                    data,
                    response
                );
            } else {
                cb(null, data, response);
            }
        }
    });
};

module.exports = CobaltClient;
