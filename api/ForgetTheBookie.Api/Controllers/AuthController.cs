using ForgetTheBookie.Api.ActionFilters;
using ForgetTheBookie.Api.Models.UserAuthentication;
using ForgetTheBookie.Database.Model;
using ForgetTheBookie.Database.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ForgetTheBookie.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;
        private readonly IUnitOfWork _uow;

        public AuthController(UserManager<User> userManager, IConfiguration configuration, ILogger<AuthController> logger, IUnitOfWork uow)
        {
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
            _uow = uow;
        }

        // POST: api/Auth/Register
        [HttpPost("Register")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromBody] RegistrationModel model)
        {
            _logger.LogInformation("Register called");

            var user = new User
            {
                UserName = model.Username,
                Email = model.Email,
                Name = model.Name,
                DateOfBirth = model.DateOfBirth,
                CreatedDate = DateTime.UtcNow,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                var userBalance = new UserBalance
                {
                    UserId = user.Id,
                    Balance = 0
                };
                _uow.Repo<UserBalance>().Insert(userBalance);
                _uow.Save();

                _logger.LogInformation("Register succeeded");
                return Ok(result);
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError, result);
        }

        // POST: api/Auth/Login
        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginModel request)
        {
            _logger.LogInformation("Login called");

            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
                return Unauthorized();

            var refreshToken = GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(30);

            await _userManager.UpdateAsync(user);

            var response = CreateToken(user);
            response.Id = user.Id;
            response.Username = user.UserName ?? "";
            response.RefreshToken = refreshToken;

            _logger.LogInformation("Login succeeded");

            return Ok(response);
        }

        [HttpPost("Refresh")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Refresh([FromBody] RefreshModel model)
        {
            _logger.LogInformation("Refresh called");

            var principal = GetPrincipalFromExpiredToken(model.AccessToken);

            if (principal?.Identity?.Name is null)
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(principal.Identity.Name);

            if (user is null || user.RefreshToken != model.RefreshToken || user.RefreshTokenExpiry < DateTime.UtcNow)
                return Unauthorized();

            var response = CreateToken(user);
            response.Id = user.Id;
            response.Username = user.UserName ?? "";
            response.RefreshToken = model.RefreshToken;

            _logger.LogInformation("Refresh succeeded");

            return Ok(response);
        }

        [Authorize]
        [HttpDelete("Revoke")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Revoke()
        {
            _logger.LogInformation("Revoke called");

            var username = HttpContext.User.Identity?.Name;

            if (username is null)
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(username);

            if (user is null)
                return Unauthorized();

            user.RefreshToken = null;

            await _userManager.UpdateAsync(user);

            _logger.LogInformation("Revoke succeeded");

            return Ok();
        }

        [Authorize]
        [HttpPut("ChangePassword")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            _logger.LogInformation("ChangePassword called");

            var user = await _userManager.FindByIdAsync(model.Id.ToString());

            if (user == null)
                return StatusCode(StatusCodes.Status404NotFound, "User does not exist.");

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

            if (result.Succeeded)
            {
                _logger.LogInformation("ChangePassword succeeded");
                return Ok(result);
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError, result);
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            var secret = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Secret no configured");
            var validation = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ValidIssuer = _configuration["Jwt:Issuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            };

            return new JwtSecurityTokenHandler().ValidateToken(token, validation, out _);
        }

        private AuthenticationResponse CreateToken(User user)
        {
            var expiration = DateTime.UtcNow.AddHours(1);
            var secret = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Secret not configured");
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var loginCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            Claim[] claims = CreateClaims(user);
            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expiration,
                signingCredentials: loginCredentials
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return new AuthenticationResponse { 
                AccessToken = tokenString,
                AccessTokenExpiry = expiration
            };
        }

        private Claim[] CreateClaims(User user) =>
            new[] {
                //new Claim("Id", user.Id.ToString()),
                //new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                //new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
            };

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];

            using var generator = RandomNumberGenerator.Create();

            generator.GetBytes(randomNumber);

            return Convert.ToBase64String(randomNumber);
        }
    }
}
