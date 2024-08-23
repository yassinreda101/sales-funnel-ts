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

    // Prepare the logo HTML if a logo is present
    const logoHtml = orderDetails.logo 
      ? `<img src="${orderDetails.logo}" alt="Company Logo" style="max-width: 200px; max-height: 200px; margin-bottom: 20px;">`
      : '';

    // Admin email with all order details and embedded logo
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
          ${logoHtml}
          <div class="order-details">
            <h2>Order Details:</h2>
            <ul>
              ${Object.entries(orderDetails).map(([key, value]) => {
                if (key === 'logo') return '';
                return `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</li>`;
              }).join('')}
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

    // Simplified client email with relevant details including link, fixed card color, and delivery information
    const clientEmailHtml = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }
          h1, h2 { color: #4F46E5; }
          .order-details, .delivery-info { background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
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
          <div class="delivery-info">
            <h2>Delivery and Pickup Options:</h2>
            <p>We offer two convenient options for receiving your SwiftCard:</p>
            <ol>
              <li><strong>Personal Delivery:</strong> We can arrange a delivery anywhere in Atlanta. Our team will reach out to you directly via text message to coordinate a suitable time and location.</li>
              <li><strong>Georgia Tech Pickup:</strong> You can pick up your order on Wednesdays in front of the Student Center at Georgia Tech.</li>
            </ol>
            <p>Our team will contact you shortly via text message to confirm your preferred option and arrange the details.</p>
          </div>
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