chrome.tabs.executeScript(null, { file: 'script.js' });

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

    // chrome.runtime.sendMessage({popupOpen: true});
    
    var send = function() {
        chrome.storage.local.get({pageInfo : []}, function(response) {
            response.pageInfo.forEach(function(singlePage) {
                var pageUrl = Object.keys(singlePage)[0];
                $.ajax({
                    url: pageUrl,
                    error: function() {
                        alert("There is an error");
                    },
                    success: function(data) {
                        var status = data.includes(singlePage[pageUrl][0].selection[0].price[0]);
                        var name = singlePage[pageUrl][0].selection[0].words[0];
                        if (!status) {

                            chrome.browserAction.setBadgeText({ text: "$" });
                            chrome.browserAction.setBadgeBackgroundColor({ color: "#bf0000" });


                            var itemSelector = $('.itemName:contains("' + name + '")');

                            itemSelector.parents('.eachWatch').css({ "background-color": "#b5e1f7", "color": "#0b2035" });

                            if (!itemSelector.next().children().length) {
                                itemSelector.next().append('<span style="color:#bf0000"> Price Change Alert</span>');
                            }

                        } else {
                            chrome.browserAction.setBadgeText({ text: "" });
                            chrome.browserAction.setBadgeBackgroundColor({ color: "#bf0000" });
                        }
                    }

                });
            });
        });
    };

    // window.setInterval(function() { send(); }, 1000);
});

//Need to figure out why it's not watching automatically
//Need to also create video via ebay