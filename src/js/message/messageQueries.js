const db = require('../dbConnection');

// * DB queries and logic * //

const getUserFriends = async (data) => {
    const friends = [];
    const params = [data.user_id];
    const relationQuery = `SELECT * FROM friends WHERE user_id=$1;`;
  
    try {
      const dbResponse = await db.any(relationQuery, params);
      const friendIDs = [];
      for (let i = 0; i < dbResponse.length; i++) {
        friendIDs.push(dbResponse[i].friend_id);
      }
      for (let i = 0; i < friendIDs.length; i++) {
        const query = `SELECT * FROM users WHERE user_id=$1;`;
        const params = [friendIDs[i]];
        const dbResponse = await db.one(query, params);
        friends.push(dbResponse);
      }
      return { status: "success", message: "User friends retrieved.", data: friends };
    } catch (error) {
      return { status: "error", error: error, message: "Error fetching friends from users_to_friends table." };
    }
};

const getUserMessages = async (data) => {
    const messages = [];
    const params = [data.user_id];
    const query = `SELECT * FROM messages WHERE receiver_id=$1 OR sender_id=$1;`;
  
    try {
      const dbResponse = await db.any(query, params);
      for (let i = 0; i < dbResponse.length; i++) {
        let messageData = {
            message_id: dbResponse[i].message_id,
            sender_id: dbResponse[i].sender_id,
            receiver_id: dbResponse[i].receiver_id,
            message: dbResponse[i].message,
            date_sent: dbResponse[i].date_sent,
            sender_data: "",
            receiver_data: ""
        }

        const senderQuery = `SELECT * FROM users WHERE user_id=$1;`;
        const senderParams = [dbResponse[i].sender_id];
        const senderResponse = await db.any(senderQuery, senderParams);
        // console.log(senderResponse);
        const receiverQuery = `SELECT * FROM users WHERE user_id=$1;`;
        const receiverParams = [dbResponse[i].receiver_id];
        const receiverResponse = await db.any(receiverQuery, receiverParams);
        // console.log(receiverResponse[0]);

        messageData.sender_data = senderResponse[0];
        messageData.receiver_data = receiverResponse[0];

        // * Grouping messages based on user * //
        function existingMessageUsers(element) {
            const senderID = element[0].sender_data.user_id;
            const receiverID = element[0].receiver_data.user_id;
            const messageSenderID = messageData.sender_data.user_id;
            const messageReceiverID = messageData.receiver_data.user_id;

            if (senderID === messageSenderID && receiverID === messageReceiverID) {
                return true;
            } else if (senderID === messageReceiverID && receiverID === messageSenderID) {
                return true;
            } else {
                return false;
            }
        }
        
        // * If messages from a given user dont yet exist then start a message "group" (Array//list of messages from a certain user) * //
        // * else add message to message group * //
        const found = messages.findIndex(existingMessageUsers);
        if (found === -1) {
            const messageWrapper = [messageData];
            messages.push(messageWrapper);
        } else {
            messages[found].push(messageData);
        }

      }
      return { status: "success", message: "User messages retrieved.", data: messages };
    } catch (error) {
      return { status: "error", error: error, message: "Error fetching messages from messages table." };
    }
};

const getUserByUsername = async (data) => {
    const params = [data.username];
    const query = `SELECT * FROM users WHERE username=$1;`;
  
    try {
      const dbResponse = await db.one(query, params);
      return { status: "success", message: "User retrieved.", data: dbResponse };
    } catch (error) {
      return { status: "error", error: error, message: "Error fetching user from users table." };
    }
}

const sendMessage = async (data) => {
    const params = [data.sender_id, data.receiver_id, data.message, data.date_sent];
    const query = `INSERT INTO messages (sender_id, receiver_id, message, date_sent) VALUES ($1, $2, $3, $4) RETURNING *;`;
  
    try {
      const dbResponse = await db.one(query, params);
      return { status: "success", message: "Message sent.", data: dbResponse };
    } catch (error) {
      return { status: "error", error: error, message: "Error sending message." };
    }
};

module.exports = {
    getUserFriends,
    getUserMessages,
    sendMessage,
    getUserByUsername
};