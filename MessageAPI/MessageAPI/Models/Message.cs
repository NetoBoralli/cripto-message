using Dapper;
using MessageAPI.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MessageAPI.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string Identifier { get; set; }
        public int ReceiverId { get; set; }
        public int SenderId { get; set; }
        public string SenderEncryptedMessage { get; set; }
        public string ReceiverEncryptedMessage { get; set; }

        public List<Message> GetMessages(string senderIdentifier, string receiverIdentifier)
        {
            if (string.IsNullOrWhiteSpace(senderIdentifier) || string.IsNullOrWhiteSpace(receiverIdentifier))
                return null;

            var query = @"
                        declare @SenderId int=(select id from users where identifier=@SenderIdentifier);
                        declare @ReceiverId int=(select id from users where identifier=@ReceiverIdentifier);
                        select
                            m.id as Id,
                            m.identifier as Identifier,
                            m.receiver_id as ReceiverId,
                            m.sender_id as SenderId,
                            m.sender_encrypted_message as SenderEncryptedMessage,
                            m.receiver_encrypted_message as ReceiverEncryptedMessage
                        from messages m
                        where (sender_id=@SenderId and receiver_id=@ReceiverId) 
                            or (sender_id=@ReceiverId and receiver_id=@SenderId) 
                        order by m.date desc;";

            using (var conn = DbProvider.GetSqlConnection())
            {
                try
                {
                    var data = conn.Query<Message>(query, new { SenderIdentifier = senderIdentifier, ReceiverIdentifier = receiverIdentifier }).ToList();
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

        public string AddMessage(int senderId, int receiverId, string senderEncryptedMessage, string receiverEncryptedMessage)
        {
            if (senderId == 0 || receiverId == 0 || string.IsNullOrWhiteSpace(senderEncryptedMessage) || string.IsNullOrWhiteSpace(receiverEncryptedMessage))
                return null;

            var query = @"insert into messages (receiver_id, sender_id, sender_encrypted_message, receiver_encrypted_message) output inserted.identifier
                          values (@ReceiverId, @SenderId, @SenderEncryptedMessage, @ReceiverEncryptedMessage);";

            using (var conn = DbProvider.GetSqlConnection())
            {
                try
                {
                    var data = conn.ExecuteScalar<string>(query, new { ReceiverId = receiverId, SenderId = senderId, SenderEncryptedMessage = senderEncryptedMessage, ReceiverEncryptedMessage = receiverEncryptedMessage });
                    if (!string.IsNullOrWhiteSpace(data))
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
    }
}
