const VERSION = 1
const CACHE = `cache:obolus:${VERSION}`

const getCache = () => self.caches.open(CACHE)

const getPathFromUrl = url => url.replace(/^https?:\/\/[^\/]+/, '')

const _default = {
    ttl: 24 * 60 * 60,
    methods: ['GET'],
}

const NetworkFirst = () => event => new Promise(async (resolve, reject) => {
    const cache = await getCache()
    try {
        const response = await fetch(event.request)
        if (_default.methods.includes(event.request.method))
            cache.put(event.request, response.clone())
        resolve(response)
    } catch (e) {
        const cached = await cache.match(event.request)
        resolve(cached)
    }
})

const NetworkOnly = () => event => new Promise(async (resolve, reject) => {
    const cache = await getCache()
    const response = await fetch(event.request)
    cache.put(event.request, response.clone())
    resolve(response)
})

const CacheFirst = () => event => new Promise(async (resolve, reject) => {
    const cache = await getCache()
    const cached = await cache.match(event.request)
    if (cached) resolve(cached)
    else {
        const response = await fetch(event.request)
        cache.put(event.request, response.clone())
        resolve(response)
    }
})

const CacheOnly = () => event => new Promise(async (resolve, reject) => {
    const cache = await getCache()
    const cached = await cache.match(event.request)
    resolve(cached)
})

const Rolling = () => event => {
}

const routes = [
    {
        match: /^\/api\//,
        handler: NetworkFirst(),
    },
    {
        match: /^\/static\/icons\//,
        handler: CacheFirst(),
    },
    {
        match: /.*/,
        handler: NetworkFirst(),
    },
]

self.addEventListener('fetch', event => {
    const path = getPathFromUrl(event.request.url)
    const route = routes.find(route => route.match.test(path))
    if (route) {
        event.respondWith(route.handler(event))
    }
})