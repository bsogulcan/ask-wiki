let selectedText;
let clientY;
let clientX;

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

        const wikiBox = document.createElement('span');
        wikiBox.id = 'wiki-box';
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
    let wikiBox = document.getElementById("wiki-box");
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
