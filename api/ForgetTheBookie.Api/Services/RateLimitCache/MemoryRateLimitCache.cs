
using Microsoft.Extensions.Caching.Memory;

namespace ForgetTheBookie.Api.Services.RateLimitCache
{
    public class MemoryRateLimitCache : IRateLimitCache
    {
        private readonly IMemoryCache _memoryCache;

        public MemoryRateLimitCache(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public T Get<T>(string key)
        {
            _memoryCache.TryGetValue(key, out var value);
            if (value == null)
                return default;
            else
                return (T)value;

        }

        public void Set<T>(string key, T value, TimeSpan? absoluteExpirationRelativeToNow = null)
        {
            var options = new MemoryCacheEntryOptions();
            if(absoluteExpirationRelativeToNow.HasValue)
            {
                options.SetAbsoluteExpiration(absoluteExpirationRelativeToNow.Value);
            }
            _memoryCache.Set(key, value, options);
        }
    }
}
