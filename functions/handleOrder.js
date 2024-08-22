const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  console.log('Received event:', event);
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { email, ...orderDetails } = JSON.parse(event.body);

    console.log('Parsed order details:', { email, ...orderDetails });

    // Use environment variable for admin email
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error('Admin email not set');
      return { statusCode: 500, body: JSON.stringify({ message: 'Server configuration error: Admin email not set' }) };
    }

    let transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    // Send email to admin
    console.log('Sending email to admin:', adminEmail);
    await transporter.sendMail({
      from: `"SwiftCard Orders" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: 'New SwiftCard Order',
      text: JSON.stringify(orderDetails, null, 2)
    });

    // Send confirmation email to client
    console.log('Sending confirmation email to client:', email);
    await transporter.sendMail({
      from: `"SwiftCard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your SwiftCard Order Confirmation',
      text: `Thank you for your order! We've received the following details:\n\n${JSON.stringify(orderDetails, null, 2)}`
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