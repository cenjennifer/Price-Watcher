function getStorage() {
    var p = new Promise(function(resolve, reject) {
        return chrome.storage.local.get(null, (response) => resolve(response.pageInfo));
    });
    return p;
}

function checkForExistingUrl(data, url) {
    for (key in data[0]) {
        if (key === url) {
            return true;
        }
    }
    return false;
}

function pushPriceOrText(array, select) {
    if (select[0] === '$') {
        array[0].selection[0].price.unshift(select);
    } else {
        array[0].selection[0].words.push(select);
    }
}

function addToStorage(selection, url, icon) {
    getStorage()
        .then((res) => {
            return res;
        })
        .then((res) => {
            var data = [{
                "selection": [{ 'words': [], 'price': [] }],
                "icon": icon,
                "date": Date.now()
            }];
            var obj = {};
            obj[url] = data;

            if (!res) {
                pushPriceOrText(data, selection);
                chrome.storage.local.set({ pageInfo: [obj] });
            } else {
                let check = checkForExistingUrl(res, url);
                if (check) {
                    pushPriceOrText(res[0][url], selection);
                } else {
                    pushPriceOrText(data, selection);
                    res[0][url] = data;
                }
            }
            chrome.storage.local.set({ pageInfo: res });
            chrome.browserAction.setBadgeText({ text: "+" });
            chrome.browserAction.setBadgeBackgroundColor({ color: "#ffb467" });
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
        "contexts": ["all"],
        "id": "context" + context
    });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.changed) {
        chrome.browserAction.setBadgeText({ text: "$" });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#bf0000" });
    }
});

chrome.tabs.onUpdated.addListener(function() {
    chrome.browserAction.setBadgeText({ text: "" });
});