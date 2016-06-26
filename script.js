let checkPriceStatus = function() {
    window.chrome.storage.local.get({ pageInfo: [] }, function(response) {
        console.log(response);
        if (response.pageInfo.length > 1) {
            _.forEach(response.pageInfo, function(singlePage) {
                let url = _.keys(singlePage)[0];
                let pageUrlSelection = singlePage[url].selection[0];
              

                $.ajax({
                    url: url,
                    error: function() {
                        console.log("There is an error");
                    },
                    success: function(data) {
                        let status = data.includes(pageUrlSelection.price[0]);
                        let name = pageUrlSelection.words[0];
                        if (!status) {
                            let itemSelector = $('.itemName:contains("' + name + '")');
                            itemSelector.parents('.eachWatch').css({ "background-color": "#b5e1f7", "color": "#0b2035" });
                            chrome.runtime.sendMessage({ changed: true });
                        }
                    }

                });

            });
        }

    });
};

window.setInterval(function() { checkPriceStatus(); }, 100000);