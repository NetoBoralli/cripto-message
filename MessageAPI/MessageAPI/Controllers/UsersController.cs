using MessageAPI.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace MessageAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [HttpGet("{identifier?}")]
        public IActionResult Get(string identifier = null)
        {
            var users = Models.User.GetUsers(identifier);

            return Ok(users);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] dynamic data)
        {
            string email = data.email;
            string password = data.password;

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                return BadRequest("Invalid data");
            }

            var user = Models.User.Login(email, password);

            if (user == null) return BadRequest("User or password incorrect");

            var obj = new
            {
                user,
                token = Token.GenerateToken(30)
            };

            return Ok(obj);
        }

        [HttpPost("signup")]
        public IActionResult SingUp([FromBody] dynamic data)
        {
            string username = data.username;
            string password = data.password;
            string email = data.email;

            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("Invalid data");
            }

            var result = Models.User.SetUser(username, password, email);

            if (result == -1) return BadRequest("User already exists");
            else if (result == 0) return BadRequest("Invalid data");

            return Ok(result);
        }

        [HttpGet("publicKey/{identifier}")]
        public IActionResult GetPublicKey(string identifier)
        {
            if (string.IsNullOrWhiteSpace(identifier))
            {
                return BadRequest("Invalid data");
            }

            var publicKey = Models.User.GetPublicKey(identifier);

            if (publicKey == null) return BadRequest("Public key not found");

            return Ok(publicKey);
        }

        [HttpPut("publicKey/{identifier}")]
        public IActionResult SetPublicKey([FromBody] dynamic data, string identifier)
        {
            string publicKey = data.publicKey;
            if (string.IsNullOrWhiteSpace(identifier) || string.IsNullOrWhiteSpace(publicKey))
            {
                return BadRequest("Invalid data");
            }

            var result = Models.User.SetPublicKey(identifier, publicKey);

            if (result == -1) return BadRequest("User already exists");
            else if (result == 0) return BadRequest("Invalid data");

            return Ok(result);
        }

        [HttpPut("privateKey/{identifier}")]
        public IActionResult SetPrivateKey([FromBody] dynamic data, string identifier)
        {
            string privateKey = data.privateKey;
            if (string.IsNullOrWhiteSpace(identifier) || string.IsNullOrWhiteSpace(privateKey))
            {
                return BadRequest("Invalid data");
            }

            try
            {
                Models.User.SetPrivateKey(identifier, privateKey);
                return Ok();
            }
            catch
            {
                return BadRequest("Error saving private key");
            }
        }

        [HttpGet("privateKey/{identifier}")]
        public IActionResult GetPrivateKey(string identifier)
        {
            if (string.IsNullOrWhiteSpace(identifier))
            {
                return BadRequest("Invalid data");
            }

            try
            {
                var privateKey = Models.User.GetPrivateKey(identifier);
                return Ok(new { privateKey }) as IActionResult;
            }
            catch
            {
                return BadRequest("The file could not be read");
            }
        }
    }
}