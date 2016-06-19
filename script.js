chrome.extension.sendMessage({ viewsource: 'clicked' }, function() {
    console.log("fired!");
});