chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('youtube.com')) {
      console.log('YouTube page loaded, sending filterVideos message');
      chrome.tabs.sendMessage(tabId, {action: "filterVideos"});
    }
  });