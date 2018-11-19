using MessageAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace MessageAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get(string senderIdentifier, string receiverIdentifier)
        {
            if (string.IsNullOrWhiteSpace(senderIdentifier) || string.IsNullOrWhiteSpace(receiverIdentifier))
                return BadRequest();

            var messages = new Message().GetMessages(senderIdentifier, receiverIdentifier);

            if (messages == null)
                return BadRequest();

            return Ok(messages);
        }

        [HttpPost]
        public IActionResult Post([FromBody] dynamic data)
        {
            int? senderId = data.senderId;
            int? receiverId = data.receiverId;
            string senderEncryptedMessage = data.senderEncryptedMessage;
            string receiverEncryptedMessage = data.receiverEncryptedMessage;

            if (senderId == 0 || senderId == null || receiverId == 0 || receiverId == null || string.IsNullOrWhiteSpace(senderEncryptedMessage) || string.IsNullOrWhiteSpace(receiverEncryptedMessage))
                return BadRequest("Invalid data");

            var res = new Message().AddMessage(senderId.Value, receiverId.Value, senderEncryptedMessage, receiverEncryptedMessage);

            if (res == 0) return BadRequest("Invalid data");

            return Ok(res);
        }

    }
}