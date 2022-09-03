const wikiUrl = 'https://wikipedia.org/wiki/';
var selectedText;

chrome.runtime.onMessage.addListener(onSelectedTextChanged);

browser.contextMenus.create({
    id: "search-on-wikipedia",
    title: "Search on Wikipedia"
});

function onSelectedTextChanged(text) {
    selectedText = normalizeSearchingText(text);

    //browser.window.open(wikiUrl + 'selectedText', "_blank");
    console.log('NormalizedText:' + selectedText);
};



browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "search-on-wikipedia") {

        console.log('Searching ' + selectedText + ' on Wikipedia');
        browser.tabs.create({ url: "" + wikiUrl + selectedText + "" });
        // const url = 'https://tr.wikipedia.org';
        // const http = new XMLHttpRequest();
        // http.open("GET", url);
        // http.send();

        // http.onreadystatechange = (e) => {
        //     if (http.readyState === 4 && http.status === 200) {
        //         console.log(http.responseText)
        //     }
        // }
        // console.log(selectedText);
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
    browser.tabs.create({ url: "" + wikiUrl + selectedText + "" });
}