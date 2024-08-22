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

// Helper function to generate an HTML-based card preview
const generateCardPreview = (orderDetails) => {
  const name = orderDetails.name || orderDetails.companyName || 'Your Name';
  const socialMedia = orderDetails.socialMedia || [];
  const link = orderDetails.link || 'your-link.com';

  // Generate social media icons
  const socialIcons = socialMedia.map(platform => {
    switch(platform.toLowerCase()) {
      case 'facebook': return 'FB';
      case 'instagram': return 'IG';
      case 'linkedin': return 'LI';
      case 'twitter': return 'TW';
      case 'x': return 'X';
      default: return '*';
    }
  }).join(' ');

  return `
    <table style="width: 300px; border: 1px solid #ccc; border-radius: 10px; overflow: hidden; font-family: Arial, sans-serif;">
      <tr>
        <td style="background-color: #f0f0f0; padding: 20px; text-align: center;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${name}</div>
          <div style="font-size: 14px; margin-bottom: 10px;">${socialIcons}</div>
          <div style="font-size: 14px;">${link}</div>
        </td>
      </tr>
    </table>
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

    // Admin email remains the same...

    const cardPreview = generateCardPreview(orderDetails);

    // Simplified client email with relevant details including link, fixed card color, and HTML card preview
    const clientEmailHtml = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #4F46E5; }
          .order-details { background-color: #f4f4f4; padding: 15px; border-radius: 5px; }
          .card-preview { margin-top: 20px; }
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