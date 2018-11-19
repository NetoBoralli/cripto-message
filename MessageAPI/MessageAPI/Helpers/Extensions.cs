using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MessageAPI.Helpers
{
    public static class Extensions
    {
        public static string SHA256Crpt(this string str, Boolean useBase64 = true)
        {
            if (str == null)
                str = "";
            using (var sha = SHA256.Create())
            {
                var bytes = sha.ComputeHash(Encoding.GetEncoding(0).GetBytes(str));
                if (useBase64)
                    return Convert.ToBase64String(bytes);
                var sb = new StringBuilder();
                foreach (var b in bytes)
                    sb.Append(b.ToString("x2"));
                return sb.ToString();
            }
        }
    }
}
