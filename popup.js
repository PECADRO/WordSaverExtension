document.addEventListener('DOMContentLoaded', () => {
  const wordList = document.getElementById('wordList');
  const copyBtn = document.getElementById('copyBtn');
  const toast = document.getElementById('toast');

  function renderWords() {
    chrome.storage.local.get({words: []}, (data) => {
      const words = data.words;
      wordList.innerHTML = '';
      
      words.forEach((word, index) => {
        const div = document.createElement('div');
        div.className = 'word-item';
        
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Add notes';
        input.dataset.index = index;
        
        div.appendChild(wordSpan);
        div.appendChild(input);
        wordList.appendChild(div);
      });
    });
  }

  // Initial render
  renderWords();

  // Copy button functionality
  copyBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.word-item input');
    const wordsWithNotes = Array.from(inputs).map(input => {
      const word = input.previousSibling.textContent;
      const note = input.value;
      return `${word}: ${note}`;
    });
    
    const textContent = wordsWithNotes.join('\n'); // One word per line
    navigator.clipboard.writeText(textContent).then(() => {
      console.log('Words copied to clipboard');
      showToast();
    }).catch((err) => {
      console.error('Failed to copy words: ', err);
    });
  });

  // Show toast notification
  function showToast() {
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
  }

  // Listen for storage changes to update popup in real-time
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && 'words' in changes) {
      renderWords();
    }
  });
});