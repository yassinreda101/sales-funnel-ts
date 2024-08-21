const nodemailer = require('nodemailer');
const twilio = require('twilio');

exports.handler = async (event, context) => {
  console.log('Received event:', event);
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, phoneNumber, ...orderDetails } = JSON.parse(event.body);

    console.log('Parsed order details:', { email, phoneNumber, ...orderDetails });

    // Use environment variable for admin email
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error('Admin email not set');
      return { statusCode: 500, body: JSON.stringify({ message: 'Server configuration error: Admin email not set' }) };
    }

    let transporter = nodemailer.createTransport({
      host: 'your-smtp-host',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email to admin
    console.log('Sending email to admin:', adminEmail);
    await transporter.sendMail({
      from: '"SwiftCard Orders" <noreply@swiftcard.com>',
      to: adminEmail,
      subject: 'New SwiftCard Order',
      text: JSON.stringify(orderDetails, null, 2)
    });

    // Send confirmation email to client
    console.log('Sending confirmation email to client:', email);
    await transporter.sendMail({
      from: '"SwiftCard" <noreply@swiftcard.com>',
      to: email,
      subject: 'Your SwiftCard Order Confirmation',
      text: `Thank you for your order! We've received the following details:\n\n${JSON.stringify(orderDetails, null, 2)}`
    });

    // Send SMS to admin
    console.log('Sending SMS to admin');
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilioClient.messages.create({
      body: `New SwiftCard order received from ${email}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.ADMIN_PHONE_NUMBER
    });

    // Send SMS to client
    console.log('Sending SMS to client:', phoneNumber);
    await twilioClient.messages.create({
      body: 'Your SwiftCard order has been received! Thank you for your purchase.',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

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