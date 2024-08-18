// popup.js
let keywords = [];

// Load existing keywords
chrome.storage.sync.get(['keywords'], function(result) {
  keywords = result.keywords || [];
  updateKeywordList();
});

document.getElementById('add').addEventListener('click', function() {
  const keyword = document.getElementById('keyword').value.trim();
  if (keyword && !keywords.includes(keyword)) {
    keywords.push(keyword);
    chrome.storage.sync.set({keywords: keywords}, function() {
      updateKeywordList();
      document.getElementById('keyword').value = '';
      notifyContentScript();
    });
  }
});

function updateKeywordList() {
  const list = document.getElementById('keywordList');
  list.innerHTML = '';
  keywords.forEach(keyword => {
    const li = document.createElement('li');
    li.textContent = keyword;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = function() {
      keywords = keywords.filter(k => k !== keyword);
      chrome.storage.sync.set({keywords: keywords}, function() {
        updateKeywordList();
        notifyContentScript();
      });
    };
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function notifyContentScript() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "refilter"});
  });
}