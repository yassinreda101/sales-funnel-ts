const nodemailer = require('nodemailer');

// Helper function to convert card color class to user-friendly string
const getCardColorString = (cardColorClass) => {
  if (typeof cardColorClass !== 'string') {
    return 'Not specified';
  }
  if (cardColorClass.includes('white')) {
    return 'White';
  }
  if (cardColorClass.includes('dark-gray')) {
    return 'Black';
  }
  return 'Not specified';
};

// Helper function to generate a simple text-based card preview
const generateCardPreview = (orderDetails) => {
  const name = orderDetails.name || orderDetails.companyName || 'Your Name';
  const socialMedia = orderDetails.socialMedia || [];
  const link = orderDetails.link || 'your-link.com';

  // Generate social media icons
  const socialIcons = socialMedia.map(platform => {
    switch(platform.toLowerCase()) {
      case 'facebook': return 'f';
      case 'instagram': return 'i';
      case 'linkedin': return 'l';
      case 'twitter': return 't';
      case 'x': return 'x';
      default: return '*';
    }
  }).join(' ');

  return `
+-----------------------------+
|                             |
|  ${name.padEnd(27)}|
|                             |
|  ${socialIcons.padEnd(27)}|
|                             |
|  ${link.padEnd(27)}|
|                             |
+-----------------------------+
  `;
};

exports.handler = async (event, context) => {
  console.log('Received event:', event);
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { email, ...orderDetails } = JSON.parse(event.body);

    console.log('Parsed order details:', { email, ...orderDetails });

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error('Admin email not set');
      return { statusCode: 500, body: JSON.stringify({ message: 'Server configuration error: Admin email not set' }) };
    }

    let transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    // Admin email with all order details
    const adminEmailHtml = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #4F46E5; }
          .order-details { background-color: #f4f4f4; padding: 15px; border-radius: 5px; }
          .footer { margin-top: 20px; font-size: 0.9em; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New SwiftCard Order Received</h1>
          <div class="order-details">
            <h2>Order Details:</h2>
            <ul>
              ${Object.entries(orderDetails).map(([key, value]) => `
                <li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</li>
              `).join('')}
            </ul>
            <p><strong>Customer Email:</strong> ${email}</p>
          </div>
          <div class="footer">
            <p>Please process this order promptly.</p>
          </div>
        </div>
      </body>
    </html>
    `;

    // Send formatted email to admin
    console.log('Sending email to admin:', adminEmail);
    await transporter.sendMail({
      from: `"SwiftCard Orders" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: 'New SwiftCard Order',
      html: adminEmailHtml
    });

    const cardPreview = generateCardPreview(orderDetails);

    // Simplified client email with relevant details including link, fixed card color, and card preview
    const clientEmailHtml = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #4F46E5; }
          .order-details { background-color: #f4f4f4; padding: 15px; border-radius: 5px; }
          .card-preview { font-family: monospace; white-space: pre; background-color: #e0e0e0; padding: 10px; border-radius: 5px; }
          .footer { margin-top: 20px; font-size: 0.9em; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Thank You for Your SwiftCard Order!</h1>
          <p>Dear valued customer,</p>
          <p>We're excited to confirm that we've received your SwiftCard order. Here are the key details of your purchase:</p>
          <div class="order-details">
            <h2>Order Summary:</h2>
            <ul>
              <li><strong>Name:</strong> ${orderDetails.name || orderDetails.companyName || 'Not specified'}</li>
              <li><strong>Card Color:</strong> ${getCardColorString(orderDetails.cardColor)}</li>
              <li><strong>Social Media:</strong> ${orderDetails.socialMedia ? orderDetails.socialMedia.join(', ') : 'None'}</li>
              <li><strong>Link:</strong> ${orderDetails.link || 'Not specified'}</li>
              <li><strong>Price:</strong> $${orderDetails.price || 'Not specified'}</li>
            </ul>
          </div>
          <h2>Card Preview:</h2>
          <div class="card-preview">
${cardPreview}
          </div>
          <p>Please note that this is a simplified preview. Your actual card will be professionally designed and may vary in appearance.</p>
          <p>We're processing your order and will update you on its status soon. If you have any questions, please don't hesitate to contact us.</p>
          <p>Thank you for choosing SwiftCard!</p>
          <div class="footer">
            <p>Best regards,<br>The SwiftCard Team</p>
          </div>
        </div>
      </body>
    </html>
    `;

    // Send confirmation email to client
    console.log('Sending confirmation email to client:', email);
    await transporter.sendMail({
      from: `"SwiftCard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your SwiftCard Order Confirmation',
      html: clientEmailHtml
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