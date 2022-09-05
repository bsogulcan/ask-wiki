let selectedText;

var wikiBoxBaseHtml = '<span id="ask-wiki-box" style="width: 30px; height: 30px; background-color: white; position: fixed; z-index: 10000; top: {{top}}px; left: {{left}}px;"></span>';

chrome.runtime.onMessage.addListener(onDataReceived);

document.addEventListener('selectionchange', () => {
    selectedText = document.getSelection().toString();
    chrome.runtime.sendMessage({
        text: selectedText,
        search: false
    });
});

window.onmouseup = function (e) {
    setTimeout(() => {
        closeSearchBox();

        if (selectedText) {
            let wikiBoxHtml = wikiBoxBaseHtml.replace('{{top}}', (e.clientY - 40))
                .replace('{{left}}', e.clientX);

            wikiBox = document.createElement('span');
            wikiBox.innerHTML = wikiBoxHtml;
            wikiBox.addEventListener("click", searchBoxOnClick.bind(null, selectedText, wikiBox), false);
            document.body.appendChild(wikiBox);

        }
    }, 100)
};

function searchBoxOnClick(text, wikiBox) {
    chrome.runtime.sendMessage({
        text: text,
        search: true
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