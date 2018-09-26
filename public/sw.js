// When service work is isntalled
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...', event);
});

// When service work is activated
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...', event);
  return self.clients.claim(); // it ensures that SW is active correctly
});

// All the above events are triggered by the browser but the fetch is by our app
// This event happens when every html is loaded and when it request assets
// and even when we specifically use Fetch API
self.addEventListener('fetch', event => {
  console.log('[Service Worker] Fetching something...', event);
  // event.respondWith(null); // overrides the data that get send back.
  // this means that consider sw as network proxy
  // the null will cause This site can’t be reached

  event.respondWith(fetch(event.request)) // return the fetch request
});
