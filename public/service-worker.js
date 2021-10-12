const FILES_TO_CACHE = [
  "./",
  "./manifest.json",
  "./index.html",
  "./css/styles.css",
  "./js/idb.js",
  "./js/index.js",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
];

const APP_PREFIX = "BudgetTracker";
const VERSION = "dataCache";
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Your files were all pre-cached completely : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
 });

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      let cachestorelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cachestorelist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("Yes, Sir!😎 delete cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  console.log("fetch request : " + event.request.url.includes("/api/"));  //be careful
  event.respondWith(
    caches.match(event.request).then(function (request) {
      if (request) {
        // if cache is available, respond with cache
        console.log("responding with cache : " + event.request.url);
        return request;
      } else {
        // if there are no cache, try fetching request
        console.log("file is not cached, fetching : " + event.request.url);
        return fetch(event.request);
      }
    })
  );
});
