// background.js
let currentWord = '';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createContextMenu") {
    currentWord = request.word;
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: "saveWord",
        title: "Save '%s' to Word Highlighter",
        contexts: ["selection"]
      });
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveWord") {
    chrome.storage.local.get({words: []}, (data) => {
      const words = data.words;
      if (!words.includes(currentWord)) {
        words.push(currentWord);
        chrome.storage.local.set({words: words}, () => {
          chrome.tabs.sendMessage(tab.id, {
            action: "highlightWord",
            word: currentWord
          });
        });
      }
    });
  }
});