namespace ForgetTheBookie.Api.Services.RateLimitCache
{
    public class RateLimitHandler : DelegatingHandler
    {
        //private readonly IMemoryCache _memoryCache;
        private readonly IRateLimitCache _cache;
        private readonly ILogger<RateLimitHandler> _logger;
        private const string RateLimitKey = "RateLimit";
        private const int RequestThreshold = 100; // Stop making request when 100 or fewer remaining request

        public RateLimitHandler(IRateLimitCache cache, ILogger<RateLimitHandler> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            // Retrieve rate limit data from cache or create new if not available
            var rateLimit = _cache.Get<RateLimitData>(RateLimitKey);
            if (rateLimit == null)
            {
                rateLimit = new RateLimitData
                {
                    RemainingRequest = 7500,
                    ResetTime = DateTime.UtcNow,
                };
                _cache.Set(RateLimitKey, rateLimit);
            }

            _logger.LogInformation($"Current wait time is {rateLimit.ResetTime - DateTime.UtcNow}");

            // If remaining request are below the threshold, wait unit the reset time
            if (rateLimit.RemainingRequest <= RequestThreshold)
            {
                var waitTime = rateLimit.ResetTime - DateTime.UtcNow;
                if (waitTime > TimeSpan.Zero)
                {
                    _logger.LogInformation($"Rate limit threshold reached. Waiting {waitTime} seconds before making the request...");

                    // Wait for the reset time before making the request
                    await Task.Delay(waitTime, cancellationToken);
                }
            }

            // Send the actual HTTP request
            _logger.LogInformation($"Making request to {request.RequestUri}");
            var response = await base.SendAsync(request, cancellationToken);

            // Process the response headers to update rate limit data
            var limit = response.Headers.GetValues("X-RateLimit-requests-Limit").FirstOrDefault();
            var remaining = response.Headers.GetValues("X-RateLimit-requests-Remaining").FirstOrDefault();
            var reset = response.Headers.GetValues("X-RateLimit-requests-Reset").FirstOrDefault();

            // Update rate limit data
            if (int.TryParse(remaining, out var remainingRequest) &&
                long.TryParse(reset, out var secondsUntilReset))
            {
                rateLimit.RemainingRequest = remainingRequest;
                rateLimit.ResetTime = DateTime.UtcNow.AddSeconds(secondsUntilReset);

                // save updated rate limit data back to the cache
                _cache.Set(RateLimitKey, rateLimit);

                _logger.LogInformation($"Updated rate limit data: {rateLimit.RemainingRequest} requests remaining, reset at {rateLimit.ResetTime} (UTC) or {rateLimit.ResetTime.ToLocalTime()} (local time)");
            }

            return response;
        }
    }

    public class RateLimitData
    {
        public int RemainingRequest { get; set; }
        public DateTime ResetTime { get; set; }
    }
}
