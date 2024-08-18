// content.js
let keywords = [];

// Fetch keywords from storage
chrome.storage.sync.get(['keywords'], function(result) {
  keywords = result.keywords || [];
  filterVideos();
});

function findVideoElements() {
  const selectors = [
    'ytd-video-renderer',
    'ytd-grid-video-renderer',
    'ytd-compact-video-renderer',
    'ytd-rich-item-renderer',
    'ytd-movie-renderer',
    'ytd-playlist-renderer'
  ];
  return document.querySelectorAll(selectors.join(','));
}

function filterVideos() {
  console.log('Filtering videos with keywords:', keywords);
  const videoElements = findVideoElements();
  
  videoElements.forEach(video => {
    const titleElement = video.querySelector('#video-title, #title');
    if (titleElement) {
      const title = titleElement.innerText.toLowerCase();
      const shouldShow = keywords.length === 0 || keywords.some(keyword => title.includes(keyword.toLowerCase()));
      
      if (shouldShow) {
        console.log('Showing video:', title);
        video.style.display = ''; // Reset to default display value
      } else {
        video.style.display = 'none';
      }
    }
  });
  
  console.log(`Processed ${videoElements.length} videos`);
}

// Set up a MutationObserver to handle dynamically loaded content
const observer = new MutationObserver((mutations) => {
  let shouldFilter = false;
  for (let mutation of mutations) {
    if (mutation.addedNodes.length) {
      shouldFilter = true;
      break;
    }
  }
  if (shouldFilter) {
    console.log('New content detected, re-filtering videos');
    filterVideos();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Listen for updates to keywords
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.keywords) {
    console.log('Keywords updated');
    keywords = changes.keywords.newValue;
    filterVideos();
  }
});

// Periodically re-filter videos to catch any that might have been missed
setInterval(filterVideos, 5000);

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "refilter") {
    filterVideos();
  }
});