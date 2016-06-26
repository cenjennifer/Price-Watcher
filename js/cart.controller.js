app.controller('getPage', function(PageDataFactory, $scope) {

    PageDataFactory.fetchChromeDb().then(function(response) {
        $scope.db = response[0];

        $scope.gotolink = function(link) {
            chrome.tabs.create({ url: link });
            return;
        };

        $scope.delete = function(link) {
            delete $scope.db[link];
            chrome.storage.local.set({ pageInfo: [$scope.db] });
            return;
        };
    });
});