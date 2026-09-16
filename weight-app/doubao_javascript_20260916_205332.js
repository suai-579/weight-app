const CACHE_NAME = 'weight-bmi-v1';
const ASSETS = [
    './index.html',
    './manifest.json',
    './icon.svg',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// 安装：缓存所有静态资源
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// 拦截请求：缓存优先，离线也能打开
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(res => {
                // 动态缓存新请求
                if (res.status === 200) {
                    const resClone = res.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
                }
                return res;
            }).catch(() => caches.match('./index.html'));
        })
    );
});
//（注：内容由AI生成）
