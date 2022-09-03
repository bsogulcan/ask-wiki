var selectedText;

chrome.runtime.onMessage.addListener(onSelectedTextChanged);

function onSelectedTextChanged(text) {
    selectedText = text;
    //console.log(selectedText);
};

browser.contextMenus.create({
    id: "get-popup",
    title: "Get popup URL"
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "get-popup") {
        const url = 'https://tr.wikipedia.org';
        const http = new XMLHttpRequest();
        http.open("GET", url);
        http.send();

        http.onreadystatechange = (e) => {
            if (http.readyState === 4 && http.status === 200) {
                console.log(http.responseText)
            }
        }
        console.log(selectedText);
    }
});

