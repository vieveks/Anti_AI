// popup.js
let keywords = [];

// Load existing keywords
chrome.storage.sync.get(['filterKeywords'], function(result) {
  keywords = result.filterKeywords || [];
  updateKeywordList();
});

document.getElementById('add').addEventListener('click', function() {
  const keyword = document.getElementById('keyword').value.trim();
  if (keyword && !keywords.includes(keyword)) {
    keywords.push(keyword);
    chrome.storage.sync.set({filterKeywords: keywords}, function() {
      updateKeywordList();
      document.getElementById('keyword').value = '';
    });
  }
});

// function updateKeywordList() {
//   const list = document.getElementById('keywordList');
//   list.innerHTML = '';
//   keywords.forEach(keyword => {
//     const li = document.createElement('li');
//     li.textContent = keyword;
//     const removeBtn = document.createElement('button');
//     removeBtn.textContent = 'Remove';
//     removeBtn.onclick = function() {
//       keywords = keywords.filter(k => k !== keyword);
//       chrome.storage.sync.set({filterKeywords: keywords}, updateKeywordList);
//     };
//     li.appendChild(removeBtn);
//     list.appendChild(li);
//   });
// }

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
        chrome.storage.sync.set({filterKeywords: keywords}, function() {
          updateKeywordList();
          // Notify content script to re-filter immediately
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "refilter"});
          });
        });
      };
      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  }
  
  // Add this at the end of popup.js
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getKeywords") {
      sendResponse({keywords: keywords});
    }
  });