using AutoMapper;
using ForgetTheBookie.Api.ActionFilters;
using ForgetTheBookie.Api.Middleware;
using ForgetTheBookie.Api.Models.Bet;
using ForgetTheBookie.Api.Models.Event;
using ForgetTheBookie.Api.Models.User;
using ForgetTheBookie.Api.Models.UserBalanceAndTransactions;
using ForgetTheBookie.Api.Services;
using ForgetTheBookie.Api.Services.RateLimitCache;
using ForgetTheBookie.Database;
using ForgetTheBookie.Database.Model;
using ForgetTheBookie.Database.Repository;
using Hangfire;
using Hangfire.Dashboard.BasicAuthorization;
using Hangfire.MemoryStorage;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

ConfigureServices(builder);

using var loggerFactory = LoggerFactory.Create(b => b.SetMinimumLevel(LogLevel.Trace).AddConsole());

var app = builder.Build();

ConfigurePipeline(app);

app.Run();

static void ConfigureServices(WebApplicationBuilder builder)
{
    builder.Services.AddControllers();

    // ENHANCEMENT: use distributed cache for staging/production
    if (builder.Environment.IsDevelopment())
    {
        builder.Services.AddMemoryCache();
        builder.Services.AddSingleton<IRateLimitCache, MemoryRateLimitCache>();
    }
    else
    {
        builder.Services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = builder.Configuration.GetConnectionString("Redis");
        });
        builder.Services.AddSingleton<IRateLimitCache, RedisRateLimitCache>();
    }

    builder.Services.AddTransient<RateLimitHandler>();

    builder.Services.AddHttpClient<DataFetchingService>(client =>
    {
        client.BaseAddress = new Uri("https://api-football-v1.p.rapidapi.com/v3/");
        var apiKey = builder.Configuration["APIFOOTBALL:Key"] ??
                     throw new InvalidOperationException("API-FOOTBALL key not configured");
        client.DefaultRequestHeaders.Add("x-rapidapi-key", apiKey);
    }).AddHttpMessageHandler<RateLimitHandler>();

    builder.Services.AddCors();

    builder.Services.AddDbContext<DatabaseContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

    builder.Services.AddScoped<ValidationFilterAttribute>();
    builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
    builder.Services.AddScoped<DataUpdateService>();

    var mapperConfig = new MapperConfiguration(mc =>
    {
        mc.AddProfile(new UserProfile());
        mc.AddProfile(new UserTransactionProfile());
        mc.AddProfile(new BetProfile());
        mc.AddProfile(new EventProfile());
    });

    IMapper mapper = mapperConfig.CreateMapper();
    builder.Services.AddSingleton(mapper);

    builder.Services.Configure<ApiBehaviorOptions>(options =>
        options.SuppressModelStateInvalidFilter = true);

    builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
    builder.Services.AddProblemDetails();

    builder.Services.AddIdentityCore<User>(options =>
    {
        options.SignIn.RequireConfirmedAccount = false;
        options.User.RequireUniqueEmail = true;

        options.Password.RequireDigit = true;
        options.Password.RequiredLength = 8;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireLowercase = true;
    }).AddEntityFrameworkStores<DatabaseContext>();

    builder.Services.AddIdentityApiEndpoints<User>().AddEntityFrameworkStores<DatabaseContext>();

    var secret = builder.Configuration["Jwt:Key"] ??
                 throw new InvalidOperationException("Secret not configured");

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidAudience = builder.Configuration["Jwt:Audience"],
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                ClockSkew = TimeSpan.Zero
            };
            options.Events = new JwtBearerEvents
            {
                OnChallenge = ctx => LogAttempt(ctx.Request.Headers, "OnChallenge"),
                OnTokenValidated = ctx => LogAttempt(ctx.Request.Headers, "OnTokenValidated")
            };
        });

    builder.Services.AddAuthorization();

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(opt =>
    {
        opt.SwaggerDoc("v1", new OpenApiInfo { Title = "FTB API", Version = "v1" });
        opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please enter token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "bearer"
        });

        opt.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] { }
            }
        });
    });

    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
                           throw new InvalidOperationException("Secret not configured");

    if (builder.Environment.IsDevelopment())
    {
        builder.Services.AddHangfire(config => { config.UseMemoryStorage(); });
    }
    else
    {
        builder.Services.AddHangfire(config => config
            .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
            .UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings()
            .UsePostgreSqlStorage(options => options.UseNpgsqlConnection(connectionString)));
    }

    builder.Services.AddHangfireServer();
}

static void ConfigurePipeline(WebApplication app)
{
    app.UseSwagger();
    app.UseSwaggerUI();

    app.UseCors(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

    app.UseHttpsRedirection();
    app.UseExceptionHandler();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    app.MapHangfireDashboard("/hangfire", new DashboardOptions
    {
        Authorization = new[]
        {
            new BasicAuthAuthorizationFilter(new BasicAuthAuthorizationFilterOptions
            {
                RequireSsl = true,
                SslRedirect = true,
                LoginCaseSensitive = true,
                Users = new[]
                {
                    new BasicAuthAuthorizationUser
                    {
                        Login = app.Configuration["Hangfire:Username"] ??
                                throw new InvalidOperationException("Hangfire username not configured"),
                        PasswordClear = app.Configuration["Hangfire:Password"] ??
                                        throw new InvalidOperationException("Hangfire password not configured")
                    }
                }
            })
        }
    });

    if (!app.Environment.IsDevelopment())
    {
        RecurringJob.AddOrUpdate<DataFetchingService>(
            "SyncLeagues",
            service => service.SyncLeagues(),
            "45 0 * * 6",
            new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });

        RecurringJob.AddOrUpdate<DataFetchingService>(
            "SyncTeams",
            service => service.SyncTeamsByLeague(),
            "50 0 * * 6",
            new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });

        RecurringJob.AddOrUpdate<DataFetchingService>(
            "SyncEvents",
            service => service.SyncFixturesByCountry(),
            "0 1 * * *",
            new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });

        RecurringJob.AddOrUpdate<DataUpdateService>(
            "UpdateUserBetStatus",
            service => service.UpdateUserBets(),
            "5 1 * * *",
            new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });
    }
}

static Task LogAttempt(IHeaderDictionary headers, string eventType)
{
    var logger = loggerFactory.CreateLogger<Program>();

    var authorizationHeader = headers["Authorization"].FirstOrDefault();

    if (authorizationHeader is null)
        logger.LogInformation($"{eventType}. JWT not present");
    else
    {
        string jwtString = authorizationHeader.Substring("Bearer ".Length);

        var jwt = new JwtSecurityToken(jwtString);

        logger.LogInformation($"{eventType}. Expiration: {jwt.ValidTo.ToLongTimeString()}. System time: {DateTime.UtcNow.ToLongTimeString()}");
    }

    return Task.CompletedTask;
}

