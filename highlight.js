chrome.tabs.executeScript(null, { file: 'script.js' });
//where should this go...
//I need this running every half second? How to make this run every few minutes.

//This will run when the user clicks on the chrome extension icon and have something selected.
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var pageObj = {
        "selectedPrice": request.viewsource,
        "url": sender.tab.url
    };
    //Storing a highlighted text in the chrome storage api
    if (request.viewsource) {
        chrome.storage.local.get({ pageInfo: [] }, function(response) {
            var pageInfoArray = response.pageInfo;
            pageInfoArray.push(pageObj);

            chrome.storage.local.set({ pageInfo: pageInfoArray }, function(data) {
                console.log(data);
            });
        });
        // $('#text').css('color', "blue");
        // $('#text').append('<div>' + pageObj.selectedPrice + '</div>');
        // $('#url').append('<button><a href="' + pageObj.url + '">Url</a></button>');
    } else {
        var send = function() {
            chrome.storage.local.get({ pageInfo: [] }, function(response) {
                console.log('I am in this function');
                response.pageInfo.forEach(function(singlePage) {
                    $.ajax({
                        url: singlePage.url,
                        error: function() {
                            alert("There is an error");
                        },
                        success: function(data) {
                            // document.getElementById('text').innerText = data;
                            // console.log(data);
                            var status = data.includes(singlePage.selectedPrice);
                            // console.log(singlePage.selectedPrice);
                            // console.log(status);
                            if (!status) {
                                console.log(singlePage);
                                // chrome.browserAction.setIcon({ path: icon });
                                chrome.browserAction.setBadgeText({ text: "$$$" });
                                chrome.browserAction.setBadgeBackgroundColor({ color: "#bf0000" });
                            }
                        }
                    });
                });
            });
        };
        // window.setInterval(function() { send(); }, 5000);
    }
});