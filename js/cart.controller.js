app.controller('getPage', function(PageDataFactory, $scope) {

    PageDataFactory.fetchChromeDb().then(function(response) {

        function convertDate() {
            for (var key in response[0]) {
                let transformDate = new Date(response[0][key][0].date).toString().split(" ");
                let newDate = transformDate[1] + '. ' + transformDate[2] + ', ' +
                    transformDate[3];
                response[0][key].date = newDate;
            }
            return response[0];
        }
        $scope.db = convertDate();

        $scope.gotolink = function(link) {
            chrome.tabs.create({ url: link });
            return;
        };

        $scope.delete = function(link) { //in progress
            delete $scope.db[link];
            chrome.storage.local.set({ pageInfo: [$scope.db] });
            return;
        };
    });
});