let selectedText;
let clientY;
let clientX;
var wikiBoxBaseHtml = '<span id="ask-wiki-box" style="width: 30px; height: 30px; background-color: white; border-radius: 10px; position: fixed; z-index: 10000; top: {{top}}px; left: {{left}}px; border-style: solid; border-color: dimgray; cursor: pointer"><p style="color:black;text-align: center;margin: 3px;font-family: auto;font-size: x-large; -moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;">W</p></span>';

chrome.runtime.onMessage.addListener(onDataReceived);

document.addEventListener('selectionchange', () => {
    selectedText = document.getSelection().toString();
    chrome.runtime.sendMessage({
        text: selectedText, search: false
    });

    closeSearchBox();

    if (selectedText) {
        let wikiBoxHtml = wikiBoxBaseHtml.replace('{{top}}', (clientY - 40))
            .replace('{{left}}', clientX);

        wikiBox = document.createElement('span');
        wikiBox.innerHTML = wikiBoxHtml;
        wikiBox.addEventListener("click", searchBoxOnClick.bind(null, selectedText, wikiBox), false);
        document.body.appendChild(wikiBox);

    }
});

window.onmousemove = function (e) {
    clientX = e.clientX;
    clientY = e.clientY;
};

function searchBoxOnClick(text, wikiBox) {
    chrome.runtime.sendMessage({
        text: text, search: true
    });
    //console.log('Clicked SearchBox Keyword=' + text);
    wikiBox.remove();
}

function closeSearchBox() {
    let wikiBox = document.getElementById("ask-wiki-box");
    if (wikiBox) {
        wikiBox.remove();
    }
}

function onDataReceived(data) {
    var el = document.createElement('html');
    el.innerHTML = data;
    const paragraphs = el.getElementsByTagName('p');
    for (let i = 0; i < paragraphs.length; i++) {
        console.log(paragraphs[i].innerText);
    }
};
