const wikiUrl = 'https://wikipedia.org/wiki/';
var selectedText;

chrome.runtime.onMessage.addListener(onSelectedTextChanged);

chrome.contextMenus.create({
    id: "search-on-wikipedia", title: "Search on Wikipedia", contexts: ["selection"],
});

function onSelectedTextChanged(message, tab) {
    selectedText = message.text;
    if (message.search) {

        //selectedText = normalizeSearchingText(message.text);
        getWikipediaContent(tab.tab.id, selectedText);
    }

};

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "search-on-wikipedia") {
        console.log('Searching ' + selectedText + ' on Wikipedia');
        openWikipedia();
    }
});


function normalizeSearchingText(text) {
    if (text.startsWith(' ')) {
        text = text.substring(1);
    }

    if (text.endsWith(' ')) {
        text = text.slice(0, -1);
    }

    return text.replaceAll(' ', '_');
}


function openWikipedia() {
    chrome.tabs.create({url: "" + wikiUrl + selectedText + ""});
}

function getWikipediaContent(tabId, selectedText) {
    fetch(wikiUrl + normalizeSearchingText(selectedText))
        .then(response => response.text())
        .then(data => {
            //console.log(data);
            const contentInfo = {
                data: data, selectedText: selectedText
            };
            chrome.tabs.sendMessage(tabId, contentInfo);
            //getPTags(data);
        })
        .catch(err => {
            console.error(err);
        });
}
