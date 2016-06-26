'use strict';
var app = require('angular').module('TrackPriceApp');
app.factory('PageDataFactory', function($q) {
    return {
        fetchChromeDb: function() {
            return $q(function(resolve, reject) {
                chrome.storage.local.get({ pageInfo: [] }, function(response) {
                    resolve(response.pageInfo);
                });
            });
        }
    };
});