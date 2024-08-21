const nodemailer = require('nodemailer');
// const twilio = require('twilio');  // Comment out this line

exports.handler = async (event, context) => {
  // ... (previous code remains the same)

  try {
    // ... (email sending code remains the same)

    // Comment out or remove the Twilio code
    /*
    console.log('Sending SMS to admin');
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilioClient.messages.create({
      body: `New SwiftCard order received from ${email}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.ADMIN_PHONE_NUMBER
    });

    console.log('Sending SMS to client:', phoneNumber);
    await twilioClient.messages.create({
      body: 'Your SwiftCard order has been received! Thank you for your purchase.',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    */

    console.log('Order processed successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order processed successfully' })
    };
  } catch (error) {
    console.error('Error processing order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Error processing order: ${error.message}` })
    };
  }
};