const defaultKeywords = ['Tutorial', 'How To', 'Learn']; // You can modify these default keywords
let keywords = [];

// Load existing keywords or use defaults
function loadKeywords() {
  chrome.storage.sync.get(['whitelistKeywords'], function(result) {
    keywords = result.whitelistKeywords || defaultKeywords;
    updateKeywordList();
  });
}

// Initialize
loadKeywords();

document.getElementById('add').addEventListener('click', function() {
  const keyword = document.getElementById('keyword').value.trim();
  if (keyword && !keywords.includes(keyword)) {
    keywords.push(keyword); // Store the keyword as-is, maintaining case
    saveKeywords();
    document.getElementById('keyword').value = '';
  }
});

document.getElementById('reset').addEventListener('click', function() {
  keywords = [...defaultKeywords];
  saveKeywords();
});

function saveKeywords() {
  chrome.storage.sync.set({whitelistKeywords: keywords}, function() {
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