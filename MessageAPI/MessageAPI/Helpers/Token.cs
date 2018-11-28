using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;

namespace MessageAPI.Helpers
{
    public class Token
    {
        public const string SECRET = "45D7C42CB65265AE97C298D439C18E5293D6615A66627B382D04491113AFD794";

        public static string GenerateToken(int? expireMinutes)
        {
            var symmetricKey = Convert.FromBase64String(SECRET);
            var tokenHandler = new JwtSecurityTokenHandler();
            var now = DateTime.UtcNow;
            var jsSerializer = new JsonSerializerSettings() { ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver() };
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Expires = now.AddMinutes(Convert.ToDouble(expireMinutes ?? 60 * 10)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(symmetricKey), SecurityAlgorithms.HmacSha256Signature),
            };
            var stoken = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(stoken);
        }
    }
}
