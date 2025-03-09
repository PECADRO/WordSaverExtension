// content.js
document.addEventListener('contextmenu', (e) => {
  try {
    const selection = window.getSelection().toString().trim();
    if (selection) {
      console.log('Selected word:', selection); // Debug log
      chrome.runtime.sendMessage({
        action: "createContextMenu",
        word: selection
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Send message error:', chrome.runtime.lastError.message);
        } else {
          console.log('Message sent successfully:', response);
        }
      });
    }
  } catch (error) {
    console.error('Error in contextmenu listener:', error);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === "highlightWord") {
      console.log('Received highlight request for:', request.word); // Debug log
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.backgroundColor = 'rgba(255, 255, 0, 0.2)'; // Very faint yellow
        span.className = 'highlighted-word';
        span.textContent = request.word;
        
        // Preserve the original text content including spaces
        const originalText = range.toString();
        const highlightedText = originalText.replace(request.word, span.outerHTML);
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = highlightedText;
        
        range.deleteContents();
        range.insertNode(tempDiv.firstChild);
        
        console.log('Word highlighted:', request.word); // Debug log
      } else {
        console.warn('No selection range available');
      }
    }
  } catch (error) {
    console.error('Error in message listener:', error);
  }
});