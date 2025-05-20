using ELibrary.Core.DTOs;
using ELibrary.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
}