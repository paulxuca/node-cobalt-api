'use strict';

const request = require('request');
const BASE_URL = 'https://cobalt.qas.im/api/1.0';

function _isValid(key) {
    return !!key;
}

function CobaltClient(opts) {
    if (!(this instanceof CobaltClient)) {
        return new CobaltClient(opts);
    }

    if (!opts.API_KEY) {
        throw new Error('Invalid API key provided');
    }

    this.apiKey = opts.API_KEY;
}

CobaltClient.prototype.get = function(path, params, cb) {
    this._makeRequest('get', path, params, cb);
};

CobaltClient.prototype._createEndpoint = function(path, params) {
    var end_point = BASE_URL + path;
    var haveParams = Object.keys(params).length != 0;
    var parameters = [];
    
    if(path.indexOf('/search') != -1 && Object.keys(params).indexOf('q') == -1){
    	throw new Error('Search query does not have required parameter q.')
    }

    if (haveParams) {
        for (var key in params) {
            if (params[key] != undefined) {
                parameters.push(`&${key}=${params[key]}`);
            }
        }
    }

    end_point += `?key=${this.apiKey}`

   
    if(parameters.length != 0){
    	for(var i =0; i< parameters.length; i++){
    		end_point += parameters[i];
    	}
    }
    return {
        url: end_point
    };

};

CobaltClient.prototype._makeRequest = function(method, path, params, cb) {

    if (typeof(params) === 'function') {
        cb = params;
        params = {};
    }

    var end_point = this._createEndpoint(path, params);
    request({
        method: method,
        url: end_point.url,
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
