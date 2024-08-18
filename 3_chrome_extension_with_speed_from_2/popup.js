const defaultKeywords = ['Tutorial', 'How To', 'Learn'];
let keywords = new Set();

// Load existing keywords or use defaults
function loadKeywords() {
  chrome.storage.sync.get(['whitelistKeywords'], function(result) {
    keywords = new Set(result.whitelistKeywords || defaultKeywords);
    updateKeywordList();
  });
}

// Initialize
loadKeywords();

document.getElementById('add').addEventListener('click', function() {
  const keyword = document.getElementById('keyword').value.trim();
  if (keyword && !keywords.has(keyword)) {
    keywords.add(keyword);
    saveKeywords();
    document.getElementById('keyword').value = '';
  }
});

function saveKeywords() {
  chrome.storage.sync.set({whitelistKeywords: Array.from(keywords)}, function() {
    updateKeywordList();
    notifyContentScript();
  });
}

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
      saveKeywords();
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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getKeywords") {
    sendResponse({keywords: keywords});
  }
});