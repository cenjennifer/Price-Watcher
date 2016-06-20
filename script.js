var checkPriceStatus = function() {
    chrome.storage.local.get({ pageInfo: [] }, function(response) {
        response.pageInfo.forEach(function(singlePage) {
            var pageUrl = Object.keys(singlePage)[0];

            $.ajax({
                url: pageUrl,
                error: function() {
                    console.log("There is an error");
                },
                success: function(data) {
                    var status = data.includes(singlePage[pageUrl][0].selection[0].price[0]);
                    var name = singlePage[pageUrl][0].selection[0].words[0];
                    console.log(status, name);
                    if (!status) {
                        var itemSelector = $('.itemName:contains("' + name + '")');
                  
                        itemSelector.parents('.eachWatch').css({ "background-color": "#b5e1f7", "color": "#0b2035" });

                        chrome.runtime.sendMessage({ changed: true });

                    }
                }

            });

        });
    });
};

// window.setInterval(function() { checkPriceStatus(); }, 5000);