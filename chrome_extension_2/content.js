let whitelistKeywords = [];

// Fetch whitelist keywords from storage
chrome.storage.sync.get(['whitelistKeywords'], function(result) {
  whitelistKeywords = result.whitelistKeywords || [];
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
  console.log('Filtering videos with whitelist keywords:', whitelistKeywords);
  const videoElements = findVideoElements();
  
  videoElements.forEach(video => {
    const titleElement = video.querySelector('#video-title, #title');
    if (titleElement) {
      const title = titleElement.innerText;
      const shouldShow = whitelistKeywords.some(keyword => title.includes(keyword));
      
      if (shouldShow) {
        video.style.display = ''; // Show matching videos
      } else {
        console.log('Hiding video:', title);
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

// Listen for updates to whitelist keywords
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.whitelistKeywords) {
    console.log('Whitelist keywords updated');
    whitelistKeywords = changes.whitelistKeywords.newValue;
    filterVideos();
  }
});

// Periodically re-filter videos to catch any that might have been missed
setInterval(filterVideos, 5000);
