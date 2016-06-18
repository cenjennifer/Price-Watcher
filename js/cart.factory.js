app.factory('PageDataFactory', function($http, $q) {
    return {
        grabPage: function() {
            return $q(function(resolve, reject) {
                    chrome.tabs.query({ 'active': true, 'currentWindow': true },
                        function(tab) {
                            alert('inside the cb');

                            //need to capture the highlighted text on the page
                            var highlighted = function() {
                                var text = "";
                                if (window.getSelection) {
                                    text = window.getSelection().toString();
                                }
                                return text;
                            };

                            var highlightPrice = highlighted();
                            var pageUrl = tab[0].url;

                            //Saving object to Chrome extension storage API
                            resolve({ pageUrl: highlightPrice });
                        });
                })
                .then(function(response) {
                    chrome.storage.local.set(response, function() {
                        message('Price Saved');
                    });
                });
        },
        fetchChromeDb: function() {
            return $q(function(resolve, reject) {
                chrome.storage.local.get({ pageInfo: [] }, function(response) {
                    resolve(response.pageInfo);
                });
            });
        }
    };
});