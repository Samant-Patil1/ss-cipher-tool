const pool = require('./db');

// Function to save an encoded message
const saveEncodedMessage = async (message) => {
    try {
        const result = await pool.query('INSERT INTO messages (encoded_message) VALUES ($1) RETURNING *', [message]);
        return result.rows[0];
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};

// Function to retrieve all encoded messages
const getEncodedMessages = async () => {
    try {
        const result = await pool.query('SELECT * FROM messages');
        return result.rows;
    } catch (error) {
        console.error('Error retrieving messages:', error);
        throw error;
    }
};

module.exports = { saveEncodedMessage, getEncodedMessages };
