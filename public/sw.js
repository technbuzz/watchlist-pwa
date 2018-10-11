const CACHE_STATIC_NAME = 'static-v14'

// When service work is isntalled
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(cache => {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/',
          '/index.html',
          '/offline.html',
          '/src/js/app.js',
          '/src/js/feed.js',
          '/src/css/style.css',
          'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
          'https://fonts.googleapis.com/css?family=Titillium+Web:400,700',
          'https://code.jquery.com/jquery-3.3.1.slim.min.js',
          'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js'

        ]).then(resp => console.log(resp)).catch(error => console.log(error))
      })
  )
});

// When service work is activated
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...', event);

  event.waitUntil(
    caches.keys()
      .then(keyList => {
        // prmoseAll b/c caches.delete returns promis 
        return Promise.all(keyList.map(key => {
          if(key !== CACHE_STATIC_NAME && key !== 'dynamic'){
            console.log('[Service Worker] REmoving old cache.', key);
            return caches.delete(key); // this returns promise
          }
        }))
      })
  )

  return self.clients.claim(); // it ensures that SW is active correctly

});

// All the above events are triggered by the browser but the fetch is by our app
// This event happens when every html is loaded and when it request assets
// and even when we specifically use Fetch API
// self.addEventListener('fetch', event => {
// //   // console.log('[Service Worker] Fetching something...', event);
// //   // event.respondWith(null); // overrides the data that get send back.
// //   // this means that consider sw as network proxy
// //   // the null will cause This site can’t be reached

// //   // event.respondWith(fetch(event.request)) // return the fetch request V1 check V2

// //   // V2: Here we are first intercepting when this particular request is available in cache
//   event.respondWith(
//     caches.match(event.request)
//       .then(response => {
//         if(response){
//           // if the cache is available than just return it
//           return response
//         } else {
//           // if not available than make a request for it
//           return fetch(event.request)
//                   // even we want to cache what ever is returned dynamically
//                   .then(res => {
//                     // we must return the res and whole catche operation, if we don't 
//                     // then we added request to cache and never return the resp to the 
//                     // index html. It would work on next refresh because it loads from 
//                     // the cache
//                     return caches.open('dynamic')
//                       .then(cache => {
//                         // the below line just consumes we need a clone to be stored in cache
//                         // cache.put(event.request.url, res);
//                         cache.put(event.request.url, res.clone());
//                         return res;
//                       })
                      
//                   }) //fetch.then
//                   // First we go for catche than network if nothing found that do the following
//                   .catch(err => {
//                     return caches.open(CACHE_STATIC_NAME)
//                       .then(cache => {
//                         return cache.match('/offline.html');
//                       })
//                   })
//         }
//       })
//       .catch(
//         // usually we don't get error just and empty response which is alreay
//         // handled in the then block
//       )
//   )
// }); //self.addEventListener('fetch')

self.addEventListener('fetch', event => {
  let url = 'https://httpbin.org/get';
  if(event.request.url.indexOf(url) > -1){ //cache with network with specific urls
    event.respondWith(
      // which cache do I open, This is empty on first load
      // it's for the dynamic asset so use dynamic cache
      caches.open('dynamic')
        .then(cache => {
          return fetch(event.request)
            .then(res => { 
              cache.put(event.request, res.clone())
              // agian the res is not send to feed.js file, it will would work on
              // next reoload from cache but won't appear first time
              return res;
            })
        })
        // at this point we are caching all the things that are already precacached
        // by static cache, we could fine tune it by checking 
        // but we don't want the old approach we don want to update the old data
        // with that new strategy && IT DOESN'T WORK OFFLINE
        // SO WHERE DOES THIS APPROACH LEAVES US, IT'S GOOD IF YOU WANT TO LOAD 
        // APP FASTER FROM CACHE IF THERE IS INTERNET ACCESS.
  
    )

  } else { //cache with network fallback stratey for all other urls
    event.respondWith(caches.match(event.request)
      .then(response => {
        if (response) {
          // if the cache is available than just return it
          return response
        } else {
          // if not available than make a request for it
          return fetch(event.request)
            // even we want to cache what ever is returned dynamically
            .then(res => {
              // we must return the res and whole catche operation, if we don't 
              // then we added request to cache and never return the resp to the 
              // index html. It would work on next refresh because it loads from 
              // the cache
              return caches.open('dynamic')
                .then(cache => {
                  // the below line just consumes we need a clone to be stored in cache
                  // cache.put(event.request.url, res);
                  cache.put(event.request.url, res.clone());
                  return res;
                })

            }) //fetch.then
            // First we go for catche than network if nothing found that do the following
            .catch(err => {
              return caches.open(CACHE_STATIC_NAME)
                .then(cache => {
                  return cache.match('/offline.html');
                })
            })
        }
      })
      .catch(
        // usually we don't get error just and empty response which is alreay
        // handled in the then block
      ))
  }

}); //self.addEventListener('fetch')

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
  )
})
