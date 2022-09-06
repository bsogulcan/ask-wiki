let selectedText;
let clientY;
let clientX;
let paragraphs;
let lastParagraphIndex;

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

function onDataReceived(contentInfo) {
    wikiResultClose();

    var el = document.createElement('html');
    el.innerHTML = contentInfo.data;
    paragraphs = el.getElementsByTagName('p');

    const paragraphList = Object.keys(paragraphs).map(index => {
        let paragraph = paragraphs[index];
        return paragraph;
    });

    paragraphs = paragraphList.filter(x => x.innerText.length > 0 && x.className != 'mw-empty-elt' && !x.innerText.includes('Other reasons this message may be displayed'));

    let wikiResultHtml = wikiResultBaseHtml.replace('{{top}}', (clientY - 40))
        .replace('{{left}}', clientX);
    const wikiResult = document.createElement('span');
    wikiResult.id = 'wiki-box-result';
    wikiResult.innerHTML = wikiResultHtml;
    document.body.appendChild(wikiResult);
    const wikiResultCloseButton = document.getElementById('wiki-result-close');
    wikiResultCloseButton.addEventListener("click", wikiResultClose.bind(null), false);

    const wikiResultTitle = document.getElementById('wiki-result-title');
    wikiResultTitle.innerText = contentInfo.selectedText;
    wikiResultTitle.href = 'www.google.com';

    const wikiResultContent = document.getElementById('wiki-result-content');
    const contentItem = document.createElement('p');

    const wikiResultLoadModeButton = document.getElementById('wiki-result-load-more');
    wikiResultLoadModeButton.addEventListener("click", wikiLoadMore.bind(null), false);

    if (paragraphs.length != 0) {
        contentItem.innerText = paragraphs[0]?.innerText;
    } else {
        contentItem.innerText = 'Wikipedia does not have an article with this exact name.';
        wikiResultLoadModeButton.remove();
    }

    wikiResultContent.appendChild(contentItem);
    lastParagraphIndex = 0;
};

function wikiResultClose() {
    const wikiResult = document.getElementById('wiki-box-result');
    if (wikiResult) {
        wikiResult.remove();
    }
}

function wikiLoadMore() {
    lastParagraphIndex++;
    const wikiResultContent = document.getElementById('wiki-result-content');
    const contentItem = document.createElement('p');
    contentItem.innerText = paragraphs[lastParagraphIndex]?.innerText;
    wikiResultContent.appendChild(contentItem);

    if (paragraphs.length - 1 == lastParagraphIndex) {
        const wikiResultLoadModeButton = document.getElementById('wiki-result-load-more');
        wikiResultLoadModeButton.remove();
    }
}
