// content.js
let filterKeywords = [];

// Fetch filter keywords from storage
chrome.storage.sync.get(['filterKeywords'], function(result) {
  filterKeywords = result.filterKeywords || [];
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
      // Add more selectors if needed
    ];
  
    return document.querySelectorAll(selectors.join(','));
  }
  
  function filterVideos() {
    console.log('Filtering videos with keywords:', filterKeywords);
    const videoElements = findVideoElements();
    
    videoElements.forEach(video => {
      const titleElement = video.querySelector('#video-title, #title');
      if (titleElement) {
        const title = titleElement.innerText.toLowerCase();
        const shouldHide = filterKeywords.some(keyword => title.includes(keyword.toLowerCase()));
        
        if (shouldHide) {
          console.log('Hiding video:', title);
          video.style.display = 'none';
        } else {
          video.style.display = ''; // Reset to default display value
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

// Listen for updates to filter keywords
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.filterKeywords) {
    console.log('Filter keywords updated');
    filterKeywords = changes.filterKeywords.newValue;
    filterVideos();
  }
});

// Periodically re-filter videos to catch any that might have been missed
setInterval(filterVideos, 5000);