using ELibrary.Core.DTOs;
using ELibrary.Domain.Entities;

namespace ELibrary.Domain.Interfaces;

public interface IAuthService
{
    Task<string?> Login(UserLoginDto dto);
    Task<User> Register(UserRegisterDto dto);
    Task<UserDto?> GetUserProfile(Guid userId);
    Task<UserDto?> UpdateProfile(Guid userId, UpdateUserDto dto);
}