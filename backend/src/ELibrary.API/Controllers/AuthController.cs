using ELibrary.Core.DTOs;
using ELibrary.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ELibrary.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
    {
        var user = await _authService.Register(dto);
        return Ok(new { user.Id, user.Username, user.Role });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
    {
        var token = await _authService.Login(dto);
        if(token is null)
            return Unauthorized("Invalid credentials");
        
        return Ok(new{ token });
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return Unauthorized();

        if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
            return BadRequest("Invalid user ID");

        var profile = await _authService.GetUserProfile(userId);
        if (profile == null)
            return NotFound();
        
        return Ok(profile);
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return Unauthorized();

        if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
            return BadRequest("Invalid user ID");

        var updatedProfile = await _authService.UpdateProfile(userId, dto);
        if (updatedProfile == null)
            return BadRequest("Invalid current password or user not found");
        
        return Ok(updatedProfile);
    }
}