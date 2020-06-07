/* global self caches*/

var CACHE_NAME = 'TRACEY_CLAN_HOTLINE';

self.addEventListener('install', function(event) {

	console.log('SW installed');

});

var routesToNotCache = ['/account/login', '/account/logout'];

self.addEventListener('fetch', function(event) {
	// console.log('Intercepted fetch:', event);
	event.respondWith(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.match(event.request)
				.then(function(response) {

					console.log(event.request.url, "Match?", response);

					var fetchPromise = fetch(event.request)
						.then(function(networkResponse) {

							if(event.request.method === 'GET'){

								var shouldCache = true;

								routesToNotCache.forEach(function(route){

									if(shouldCache){

										if(event.request.url.indexOf(route) > -1){
											shouldCache = false;
										}

									}

								});

								if(shouldCache){
									// console.log('Decided to cache:', event.request.url);
									cache.put(event.request, networkResponse.clone());
								}

							}

							return networkResponse;
						
						})
					
					;
				
				return response || fetchPromise;
			
			})
		})
	);
});

self.addEventListener('activate', function(event){

	console.log('Service worker activated');
    event.waitUntil(self.clients.claim());

}, false);