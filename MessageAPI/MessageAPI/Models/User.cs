using Dapper;
using MessageAPI.Helpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace MessageAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Identifier { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string PublicKey { get; set; }

        public static List<User> GetUsers(string identifier = null)
        {
            var query = $@"select
                                u.id as Id,
                                u.identifier as Identifier,
                                u.username as Username,
                                u.email as Email,
                                u.public_key as PublicKey
                            from users u
                            {(!string.IsNullOrWhiteSpace(identifier) ? "where u.identifier=@Identifier" : null)};";

            using (var conn = DbProvider.GetSqlConnection())
            {
                try
                {
                    var data = conn.Query<User>(query, new { Identifier = identifier }).ToList();
                    if (data != null)
                        return data;
                    else
                        throw new Exception("No data returned.");
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
        }

        public static User Login(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                return null;
            }
            var query = @"select
                                u.id as Id,
                                u.identifier as Identifier,
                                u.username as Username,
                                u.email as Email,
                                u.public_key as PublicKey
                            from users u
                            where u.email=@Email and u.password=@Password 
                            ";

            using (var conn = DbProvider.GetSqlConnection())
            {
                try
                {
                    var data = conn.Query<User>(query, new { Email = email, Password = GetSHA(password) })?.FirstOrDefault();
                    if (data != null)
                        return data;
                    else
                        return null;
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
        }

        public static int SetUser(string username, string password, string email)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(email))
            {
                return 0;
            }

            var query = @"insert into users (username, password, email) output inserted.identifier
                          values (@Username, @Password, @Email);";

            using (var conn = DbProvider.GetSqlConnection())
            {
                try
                {
                    var data = conn.ExecuteScalar<int>(query, new { Username = username, Password = GetSHA(password), Email = email });
                    if (data != 0)
                        return data;
                    else
                        return 0;
                }
                catch (Exception e)
                {
                    if (e.Message.Contains("Input string was not in a correct format.")) return 1;
                    if (e.Message.Contains("UNIQUE KEY constraint")) return -1;
                    throw e;
                }
            }
        }

        public static string GetPublicKey(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return null;
            }
            var query = @"select
                                u.public_key
                            from users u
                            where u.email=@Email";

            using (var conn = DbProvider.GetSqlConnection())
            {
                try
                {
                    var data = conn.Query<string>(query, new { Email = email })?.FirstOrDefault();
                    if (data != null)
                        return data;
                    else
                        return null;
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
        }

        public static int SetPublicKey(string identifier, string publicKey)
        {
            if (string.IsNullOrWhiteSpace(identifier) || string.IsNullOrWhiteSpace(publicKey))
            {
                return 0;
            }

            var query = @"update users set public_key=@PublicKey where identifier=@Identifier;";

            using (var conn = DbProvider.GetSqlConnection())
            {
                try
                {
                    var data = conn.ExecuteScalar<int>(query, new { PublicKey = publicKey, Identifier = identifier });
                    return 1;
                }
                catch (Exception e)
                {
                    if (e.Message.Contains("UNIQUE KEY constraint")) return -1;
                    throw e;
                }
            }
        }

        public static async void SetPrivateKey(string identifier, string text)
        {
            // Set a variable to the My Documents path.
            string mydocpath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);

            // Write the text asynchronously to a new file named "WriteTextAsync.txt".
            using (StreamWriter outputFile = new StreamWriter(Path.Combine(mydocpath, $"{identifier}.priv")))
            {
                await outputFile.WriteAsync(text);
            }
        }

        public static string GetPrivateKey(string identifier)
        {
            string mydocpath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            try
            {   // Open the text file using a stream reader.
                using (StreamReader sr = new StreamReader(Path.Combine(mydocpath, $"{identifier}.priv")))
                {
                    // Read the stream to a string, and write the string to the console.
                    string privateKey = sr.ReadToEnd();
                    return !string.IsNullOrWhiteSpace(privateKey) ? privateKey : null;
                }
            }
            catch
            {
                throw new Exception();
            }
        }

        public static string GetSHA(string password)
        {
            return password.SHA256Crpt(false);
        }
    }
}
