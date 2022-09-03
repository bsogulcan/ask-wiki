var selectedText;

chrome.runtime.onMessage.addListener(onSelectedTextChanged);

function onSelectedTextChanged(text) {
    selectedText = text;
};

browser.contextMenus.create({
    id: "get-popup",
    title: "Get popup URL"
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "get-popup") {
        const url = 'https://www.google.com.tr/';
        const Http = new XMLHttpRequest();
        Http.open("GET", url);
        Http.send();

        Http.onreadystatechange = (e) => {
            if (Http.readyState === 4 && Http.status === 200) {
                console.log(Http.responseText)
            }
        }
        //console.log(selectedText);
    }
});

