const nodemailer = require('nodemailer');
const twilio = require('twilio');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, phoneNumber, ...orderDetails } = JSON.parse(event.body);

  // Use environment variable for admin email
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error('Admin email not set');
    return { statusCode: 500, body: 'Server configuration error' };
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
  await transporter.sendMail({
    from: '"SwiftCard Orders" <noreply@swiftcard.com>',
    to: adminEmail,
    subject: 'New SwiftCard Order',
    text: JSON.stringify(orderDetails, null, 2)
  });

  // Send confirmation email to client
  await transporter.sendMail({
    from: '"SwiftCard" <noreply@swiftcard.com>',
    to: email,
    subject: 'Your SwiftCard Order Confirmation',
    text: `Thank you for your order! We've received the following details:\n\n${JSON.stringify(orderDetails, null, 2)}`
  });

  // Send SMS to admin
  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await twilioClient.messages.create({
    body: `New SwiftCard order received from ${email}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: process.env.ADMIN_PHONE_NUMBER
  });

  // Send SMS to client
  await twilioClient.messages.create({
    body: 'Your SwiftCard order has been received! Thank you for your purchase.',
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Order processed successfully' })
  };
};