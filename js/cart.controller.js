app.controller('getPage', function(PageDataFactory, $scope) {
    PageDataFactory.fetchChromeDb().then(function(response) {
        $scope.db = response;
        $scope.gotolink = function(link) {
            chrome.tabs.create({ url: link });
            return;
        };
    });
});

//If there is a price change -> 
// highlight the item 
// send notification
// list the new price