using ForgetTheBookie.Database;
using Microsoft.EntityFrameworkCore;
using ForgetTheBookie.Database.Model;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using ForgetTheBookie.Database.Repository;
using AutoMapper;
using ForgetTheBookie.Api.Models.User;
using ForgetTheBookie.Api.Models.UserBalanceAndTransactions;
using ForgetTheBookie.Api.Models.Bet;
using ForgetTheBookie.Api.Models.Event;
using ForgetTheBookie.Api.ActionFilters;
using Microsoft.AspNetCore.Mvc;
using ForgetTheBookie.Api.Middleware;
using Hangfire;
using Hangfire.PostgreSql;
using ForgetTheBookie.Api.Services;
using Hangfire.MemoryStorage;
using ForgetTheBookie.Api.Services.RateLimitCache;
using Hangfire.Dashboard.BasicAuthorization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// ENHANCEMENT: use distributed cache for staging/production
if(builder.Environment.IsDevelopment())
{
    builder.Services.AddMemoryCache();
    builder.Services.AddSingleton<IRateLimitCache, MemoryRateLimitCache>();
} else
{
    builder.Services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = builder.Configuration.GetConnectionString("Redis");
    });
    builder.Services.AddSingleton<IRateLimitCache, RedisRateLimitCache>();
}

//builder.Services.AddSingleton<RateLimitHandler>();
builder.Services.AddTransient<RateLimitHandler>();

//if (!builder.Environment.IsDevelopment())
//{
//    var rapidApiKey = Environment.GetEnvironmentVariable("RAPIDAPIKEY") ?? throw new InvalidOperationException("Rapid API key secret not configured");
//    builder.Configuration["APIFOOTBALL:Key"] = rapidApiKey;
//}

builder.Services.AddHttpClient<DataFetchingService>(client =>
{
    client.BaseAddress = new Uri("https://api-football-v1.p.rapidapi.com/v3/");
    var apiKey = builder.Configuration["APIFOOTBALL:Key"] ?? throw new InvalidOperationException("API-FOOTBALL key not configured"); ;
    //client.DefaultRequestHeaders.Add("x-rapidapi-host", "api-football-v1.p.rapidapi.com");
    client.DefaultRequestHeaders.Add("x-rapidapi-key", apiKey);
}).AddHttpMessageHandler<RateLimitHandler>();

builder.Services.AddCors();

builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Services.AddScoped<IJwtService,  JwtService>();
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

builder.Services.Configure<ApiBehaviorOptions>(options
    => options.SuppressModelStateInvalidFilter = true);

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

using var loggerFactory = LoggerFactory.Create(b => b.SetMinimumLevel(LogLevel.Trace).AddConsole());

var secret = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Secret not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    //options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        //options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)
            ),
            ClockSkew = TimeSpan.Zero
        };
        options.Events = new JwtBearerEvents
        {
            OnChallenge = ctx => LogAttempt(ctx.Request.Headers, "OnChallenge"),
            OnTokenValidated = ctx => LogAttempt(ctx.Request.Headers, "OnTokenValidated")
        };
    });

builder.Services.AddAuthorization();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Secret not configured");

// Configure Hangfire

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddHangfire(config =>
    {
        config.UseMemoryStorage();
    });
}
else
{
    builder.Services.AddHangfire(config => config
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UsePostgreSqlStorage(options => options.UseNpgsqlConnection(connectionString))
    );
}

builder.Services.AddHangfireServer();

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseSwagger();
app.UseSwaggerUI();

//app.MapIdentityApi<User>();

//app.UseCors(p => p.WithOrigins("http://localhost:3000", "https://ftbapi.azurewebsites.net")
//    .AllowAnyHeader().AllowAnyMethod());

app.UseCors(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.UseHttpsRedirection();

app.UseExceptionHandler();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

//Hangfire Dashboard
//app.UseHangfireDashboard();
app.MapHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] {
    new BasicAuthAuthorizationFilter(new BasicAuthAuthorizationFilterOptions {
      RequireSsl    = true,
      SslRedirect = true,
      LoginCaseSensitive = true,
      Users = new [] {
        new BasicAuthAuthorizationUser {
            Login = builder.Configuration["Hangfire:Username"] ?? throw new InvalidOperationException("Hangfire username not configured"),
            PasswordClear = builder.Configuration["Hangfire:Password"] ?? throw new InvalidOperationException("Hangfire password not configured")
        }
      }
    })
  }
});

if (app.Environment.IsDevelopment())
{

} else
{
    // Schedule Leagues sync
    RecurringJob.AddOrUpdate<DataFetchingService>(
        "SyncLeagues",
        service => service.SyncLeagues(),
        "45 0 * * 6",  // Run every Saturday at 12:45AM UTC (8:45AM UTC+8 OR 1:45AM UK time)
        new RecurringJobOptions
        {
            TimeZone = TimeZoneInfo.Utc
        }
    );

    // Schedule Teams sync
    RecurringJob.AddOrUpdate<DataFetchingService>(
        "SyncTeams",
        //service => service.SyncTeamsByCountry(),
        service => service.SyncTeamsByLeague(),
        "50 0 * * 6",  // Run every Saturday at 12:50AM UTC (8:50AM UTC+8 OR 1:50AM UK time)
        new RecurringJobOptions
        {
            TimeZone = TimeZoneInfo.Utc
        }
    );

    // NOTE: Leagues and Teams must be synced first before syncing fixtures/events

    // Schedule Fixture/Event sync
    RecurringJob.AddOrUpdate<DataFetchingService>(
        "SyncEvents",
        service => service.SyncFixturesByCountry(),
        "0 1 * * *",  // run daily at 1AM UTC (9AM UTC+8 OR 2AM UK time)
                      //"0 1,13 * * *",  // run 2x daily at 1AM and 1PM UTC (9AM and 9PM UTC+8 OR 2AM and 2PM UK time)
        new RecurringJobOptions
        {
            TimeZone = TimeZoneInfo.Utc
        }
    );

    RecurringJob.AddOrUpdate<DataUpdateService>(
        "UpdateUserBetStatus",
        service => service.UpdateUserBets(),
        "5 1 * * *",  // run daily at 1:05AM UTC (9:05AM UTC+8 OR 2:05AM UK time)
                      //"10 1,13 * * *",  // run 2x daily at 1:10AM and 1:10PM UTC (9:10AM and 9:10PM UTC+8 OR 2:10AM and 2:10PM UK time)
        new RecurringJobOptions
        {
            TimeZone = TimeZoneInfo.Utc
        }
    );

    /*
     * Breakdown:
        10 – minute (10th minute)
        0 – hour (00:00, i.e. 12 AM)
        * – every day of the month
        * – every month
        * – every day of the week
     */
}

app.Run();

Task LogAttempt(IHeaderDictionary headers, string eventType)
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
