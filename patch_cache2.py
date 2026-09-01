import re

with open('src/lib/cache.ts', 'r') as f:
    content = f.read()

content = content.replace("CLIENT_CACHE_DURATION_MS = 1000 * 60;", "CLIENT_CACHE_DURATION_MS = 1000 * 10; // 10 seconds")

with open('src/lib/cache.ts', 'w') as f:
    f.write(content)
