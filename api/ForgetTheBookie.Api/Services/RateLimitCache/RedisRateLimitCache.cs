
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace ForgetTheBookie.Api.Services.RateLimitCache
{
    public class RedisRateLimitCache : IRateLimitCache
    {
        private readonly IDistributedCache _distributedCache;

        public RedisRateLimitCache(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }

        public T Get<T>(string key)
        {
            var data = _distributedCache.Get(key);
            if(data == null)
                return default;
            return JsonSerializer.Deserialize<T>(data);
        }

        public void Set<T>(string key, T value, TimeSpan? absoluteExpirationRelativeToNow = null)
        {
            var options = new DistributedCacheEntryOptions();
            if(absoluteExpirationRelativeToNow.HasValue)
            {
                options.SetAbsoluteExpiration(absoluteExpirationRelativeToNow.Value);
            }
            var data = JsonSerializer.Serialize(value);
            _distributedCache.SetString(key, data, options);
        }
    }
}
