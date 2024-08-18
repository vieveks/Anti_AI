// let whitelistKeywords = [];

// // Fetch whitelist keywords from storage
// chrome.storage.sync.get(['whitelistKeywords'], function(result) {
//   whitelistKeywords = result.whitelistKeywords || [];
//   filterVideos();
// });

// function findVideoElements() {
//   const selectors = [
//     'ytd-video-renderer',
//     'ytd-grid-video-renderer',
//     'ytd-compact-video-renderer',
//     'ytd-rich-item-renderer',
//     'ytd-movie-renderer',
//     'ytd-playlist-renderer'
//   ];
//   return document.querySelectorAll(selectors.join(','));
// }

// function filterVideos() {
//   console.log('Filtering videos with whitelist keywords:', whitelistKeywords);
//   const videoElements = findVideoElements();
  
//   videoElements.forEach(video => {
//     const titleElement = video.querySelector('#video-title, #title');
//     if (titleElement) {
//       const title = titleElement.innerText.toLowerCase();
//       const shouldShow = whitelistKeywords.some(keyword => 
//         title.includes(keyword.toLowerCase())
//       );
      
//       if (shouldShow) {
//         video.style.display = ''; // Show matching videos
//       } else {
//         video.style.display = 'none'; // Hide non-matching videos
//       }
//     }
//   });
  
//   console.log(`Processed ${videoElements.length} videos`);
// }

// // Debounce function
// function debounce(func, wait) {
//   let timeout;
//   return function(...args) {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func.apply(this, args), wait);
//   };
// }

// // Debounced filter function
// const debouncedFilter = debounce(filterVideos, 250);

// // Set up a MutationObserver to handle dynamically loaded content
// const observer = new MutationObserver((mutations) => {
//   let shouldFilter = false;
//   for (let mutation of mutations) {
//     if (mutation.addedNodes.length) {
//       shouldFilter = true;
//       break;
//     }
//   }
//   if (shouldFilter) {
//     console.log('New content detected, re-filtering videos');
//     debouncedFilter();
//   }
// });

// observer.observe(document.body, { childList: true, subtree: true });

// // Listen for updates to whitelist keywords
// chrome.storage.onChanged.addListener(function(changes, namespace) {
//   if (changes.whitelistKeywords) {
//     console.log('Whitelist keywords updated');
//     whitelistKeywords = changes.whitelistKeywords.newValue;
//     debouncedFilter();
//   }
// });

// // Initial filter
// filterVideos();

// // Periodically re-filter videos to catch any that might have been missed
// setInterval(debouncedFilter, 5000);

// new version 2

// let whitelistKeywords = [];
// let lastFilterTime = 0;
// const FILTER_INTERVAL = 2000; // 2 seconds

// // Fetch whitelist keywords from storage
// chrome.storage.sync.get(['whitelistKeywords'], function(result) {
//   whitelistKeywords = result.whitelistKeywords || [];
//   filterVideos();
// });

// function findVideoElements() {
//   const selectors = [
//     'ytd-video-renderer',
//     'ytd-grid-video-renderer',
//     'ytd-compact-video-renderer',
//     'ytd-rich-item-renderer',
//     'ytd-movie-renderer',
//     'ytd-playlist-renderer'
//   ];
//   return document.querySelectorAll(selectors.join(','));
// }

// function filterVideos() {
//   const now = Date.now();
//   if (now - lastFilterTime < FILTER_INTERVAL) return;
//   lastFilterTime = now;

//   console.log('Filtering videos with whitelist keywords:', whitelistKeywords);
//   const videoElements = findVideoElements();
//   const lowercaseKeywords = whitelistKeywords.map(kw => kw.toLowerCase());
  
//   videoElements.forEach(video => {
//     if (video.dataset.filtered) return; // Skip already filtered videos
    
//     const titleElement = video.querySelector('#video-title, #title');
//     if (titleElement) {
//       const title = titleElement.innerText.toLowerCase();
//       const shouldShow = lowercaseKeywords.some(keyword => title.includes(keyword));
      
//       video.style.display = shouldShow ? '' : 'none';
//       video.dataset.filtered = 'true';
//     }
//   });
  
//   console.log(`Processed ${videoElements.length} videos`);
// }

// // Throttle function
// function throttle(func, limit) {
//   let inThrottle;
//   return function() {
//     const args = arguments;
//     const context = this;
//     if (!inThrottle) {
//       func.apply(context, args);
//       inThrottle = true;
//       setTimeout(() => inThrottle = false, limit);
//     }
//   }
// }

// // Throttled filter function
// const throttledFilter = throttle(filterVideos, FILTER_INTERVAL);

// // Set up a MutationObserver to handle dynamically loaded content
// const observer = new MutationObserver((mutations) => {
//   let shouldFilter = false;
//   for (let mutation of mutations) {
//     if (mutation.addedNodes.length) {
//       shouldFilter = true;
//       break;
//     }
//   }
//   if (shouldFilter) {
//     console.log('New content detected, re-filtering videos');
//     throttledFilter();
//   }
// });

// observer.observe(document.body, { childList: true, subtree: true });

// // Listen for updates to whitelist keywords
// chrome.storage.onChanged.addListener(function(changes, namespace) {
//   if (changes.whitelistKeywords) {
//     console.log('Whitelist keywords updated');
//     whitelistKeywords = changes.whitelistKeywords.newValue;
//     // Reset filtered status when keywords change
//     document.querySelectorAll('[data-filtered]').forEach(el => delete el.dataset.filtered);
//     throttledFilter();
//   }
// });

// // Initial filter
// filterVideos();

// // Periodically re-filter videos to catch any that might have been missed
// setInterval(throttledFilter, 5000);

// version 3

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
      const title = titleElement.innerText.toLowerCase();
      const shouldShow = whitelistKeywords.some(keyword => 
        title.includes(keyword.toLowerCase())
      );
      
      video.style.display = shouldShow ? '' : 'none';
    }
  });
  
  console.log(`Processed ${videoElements.length} videos`);
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Debounced filter function
const debouncedFilter = debounce(filterVideos, 250);

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
    debouncedFilter();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Listen for updates to whitelist keywords
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.whitelistKeywords) {
    console.log('Whitelist keywords updated');
    whitelistKeywords = changes.whitelistKeywords.newValue;
    debouncedFilter();
  }
});

// Initial filter
filterVideos();

// Periodically re-filter videos to catch any that might have been missed
setInterval(debouncedFilter, 2000);