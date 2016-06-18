function getStorage() {
    var p = new Promise(function(resolve, reject) {
        return chrome.storage.local.get({ pageInfo: [] }, (response) => resolve(response.pageInfo));
    });
    return p;
}

function checkForExistingUrl(data, url) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        if (Object.keys(data[i]) === url) {
            return index + 1; // 0 is false
        }
    }
    return false;
}

function addToStorage(selection, url, icon) {
    getStorage()
        .then((res) => {
            return res;
        })
        .then((res) => {
            let check = checkForExistingUrl(res, url);
            if (check) {
                res[check - 1][url][0].selection.push(selection);
            } else {
                var newObj = {};
                newObj[url] = [{ "selection": [selection] }, { "icon": icon }, { "url": url }];
                res.push(newObj);
            }
            chrome.storage.local.set({ pageInfo: res });
            chrome.browserAction.setBadgeText({ text: "+" });
            setTimeout(function() {
                chrome.browserAction.setBadgeText({ text: "" });
            }, 1000);
        });
}

function onClickHandler(info, tab) {
    var selection = info.selectionText;
    var icon = tab.favIconUrl;
    var url = tab.url;
    addToStorage(selection, url, icon);
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function() {
    var title = "Price Tracker";
    var context = "selection";
    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": [context],
        "id": "context" + context
    });
    // alert("Extension Menu Activated");
});