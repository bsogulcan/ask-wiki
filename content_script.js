var selectedText;
document.addEventListener('selectionchange', () => {
    selectedText = document.getSelection().toString();
});

window.onmouseup = function () {
    if (selectedText) {
        chrome.runtime.sendMessage(selectedText);
    }
};
