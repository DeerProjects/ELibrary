using System.Text.Json.Serialization;

namespace ELibrary.Core.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum UserRole
{
    Admin = 1,
    Student = 0
}