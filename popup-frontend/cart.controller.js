'use strict';
var app = require('angular').module('TrackPriceApp');
const _ = require('lodash');
app.controller('getPage', function(PageDataFactory, $scope) {
    $scope.noProducts = true;
    PageDataFactory.fetchChromeDb().then(function(response) {
        $scope.db = response[0];
        _.size($scope.db) ? $scope.noProducts = false : $scope.noProducts = true;


        $scope.gotolink = function(link) {
            chrome.tabs.create({ url: link });
            return;
        };

        $scope.delete = function(link) {
            $scope.db = _.omit($scope.db, [link]);
            chrome.storage.local.set({ pageInfo: [$scope.db] });
            return;
        };
    });
});