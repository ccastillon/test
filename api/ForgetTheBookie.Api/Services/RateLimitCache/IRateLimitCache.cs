namespace ForgetTheBookie.Api.Services.RateLimitCache
{
    public interface IRateLimitCache
    {
        T Get<T>(string key);
        void Set<T>(string key, T value, TimeSpan? absoluteExpirationRelativeToNow = null);
    }
}
