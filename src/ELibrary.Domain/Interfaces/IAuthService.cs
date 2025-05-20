using ELibrary.Core.DTOs;
using ELibrary.Domain.Entities;

namespace ELibrary.Domain.Interfaces;

public interface IAuthService
{
   Task<User> Register(UserRegisterDto dto);
    Task<string?> Login(UserLoginDto dto);
}