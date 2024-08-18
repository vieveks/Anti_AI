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

// let whitelistKeywords = new Set();
// let keywordRegex = null;

// // Fetch whitelist keywords from storage
// chrome.storage.sync.get(['whitelistKeywords'], function(result) {
//   whitelistKeywords = new Set(result.whitelistKeywords || []);
//   updateRegex();
//   filterVideos();
// });

// function updateRegex() {
//   const escapedKeywords = Array.from(whitelistKeywords).map(keyword => 
//     keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
//   );
//   keywordRegex = new RegExp(escapedKeywords.join('|'), 'i');
// }

// function findVideoElements() {
//   return document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer');
// }

// function filterVideos() {
//   console.log('Filtering videos with whitelist keywords:', Array.from(whitelistKeywords));
//   const videoElements = findVideoElements();
  
//   for (let video of videoElements) {
//     const titleElement = video.querySelector('#video-title, #title');
//     if (titleElement) {
//       const title = titleElement.innerText;
//       const shouldShow = keywordRegex.test(title);
      
//       video.style.display = shouldShow ? '' : 'none';
//     }
//   }
  
//   console.log(`Processed ${videoElements.length} videos`);
// }

// // Debounce function
// function debounce(func, wait) {
//   let timeout;
//   return function executedFunction(...args) {
//     const later = () => {
//       clearTimeout(timeout);
//       func(...args);
//     };
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//   };
// }

// // Debounced filter function
// const debouncedFilter = debounce(filterVideos, 250);

// // Set up a MutationObserver to handle dynamically loaded content
// const observer = new MutationObserver(debouncedFilter);
// observer.observe(document.body, { childList: true, subtree: true });

// // Listen for updates to whitelist keywords
// chrome.storage.onChanged.addListener(function(changes, namespace) {
//   if (changes.whitelistKeywords) {
//     whitelistKeywords = new Set(changes.whitelistKeywords.newValue);
//     updateRegex();
//     debouncedFilter();
//   }
// });
