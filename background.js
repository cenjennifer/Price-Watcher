'use strict';
let browser = chrome.browserAction;
let storage = chrome.storage.local;

function getStorage() {
    let p = new Promise(function(resolve, reject) {
        return storage.get(null, (response) => resolve(response.pageInfo));
    });
    return p;
}

function checkForExistingUrl(data, url) {
    _.forIn(data[0], function(key) {
        if (key === url) {
            return true;
        }
    });
    return false;
}

function pushPriceOrText(array, select) {
    let itemContentHolder = array[0].selection[0];
    select[0] === '$' ? itemContentHolder.price.unshift(select) : itemContentHolder.words.push(select);
}

function addToStorage(selection, url, icon) {
    getStorage()
        .then((res) => {
            return res;
        })
        .then((res) => {
            let data = [{
                "selection": [{ 'words': [], 'price': [] }],
                "icon": icon,
                "date": Date.now()
            }];
            let obj = {};
            obj[url] = data;

            if (!res) {
                pushPriceOrText(data, selection);
                storage.set({ pageInfo: [obj] });
            } else {
                if (checkForExistingUrl(res, url)) {
                    pushPriceOrText(res[0][url], selection);
                } else {
                    pushPriceOrText(data, selection);
                    res[0][url] = data;
                }
            }
            storage.set({ pageInfo: res });
            browser.setBadgeText({ text: "+" });
            browser.setBadgeBackgroundColor({ color: "#ffb467" });
            setTimeout(function() {
                browser.setBadgeText({ text: "" });
            }, 1000);
        });
}

function onClickHandler(info, tab) {
    let selection = info.selectionText;
    let icon = tab.favIconUrl;
    let url = tab.url;
    addToStorage(selection, url, icon);
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function() {
    const title = "Price Tracker";
    const context = "selection";
    const id = chrome.contextMenus.create({
        "title": title,
        "contexts": ["all"],
        "id": "context" + context
    });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.changed) {
        browser.setBadgeText({ text: "$" });
        browser.setBadgeBackgroundColor({ color: "#bf0000" });
    }
});

chrome.tabs.onUpdated.addListener(function() {
    browser.setBadgeText({ text: "" });
});