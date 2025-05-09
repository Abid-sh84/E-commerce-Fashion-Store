import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';

// Create transporter using the configuration from .env file
const createTransporter = () => {
  console.log('Setting up email transport for contact form...');
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
  });
};

// Initialize email transporter
let transporter;
try {
  transporter = createTransporter();
  
  // Test connection
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP Connection Error for contact form:', error);
    } else {
      console.log("SMTP server connection for contact form verified successfully");
    }
  });
} catch (err) {
  console.error('Error initializing contact form email transport:', err);
}

// @desc    Send contact form message via email
// @route   POST /api/contact
// @access  Public
const sendContactEmail = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Validate the input
  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }
  
  // Always recreate transporter to ensure fresh connection
  try {
    transporter = createTransporter();
  } catch (err) {
    console.error('Failed to create contact form email transporter:', err);
    res.status(500);
    throw new Error('Email service is currently unavailable. Please try again later.');
  }
  
  try {
    console.log('Sending contact form email from:', email);
    
    // Format the email content with the site's color theme
    const emailContent = `
      <div style="background-color: #000000; color: #ffffff; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; border: 1px solid #333333;">
        <h2 style="color: #f59e0b; text-align: center; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
        <h3 style="color: #f59e0b; margin-top: 20px;">Message:</h3>
        <p style="background-color: #1a1a1a; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
        <p style="font-size: 12px; margin-top: 30px; color: #666666;">This message was sent from the contact form on your website.</p>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Fashion Store" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to the store email address
      replyTo: email, // Set reply-to as the sender's email
      subject: `Contact Form: ${subject || 'New Message'}`,
      html: emailContent,
      text: `New Contact Form Message\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || 'No Subject'}\n\nMessage:\n${message}\n\nThis message was sent from the contact form on your website.`,
    });

    console.log('Contact form email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    // Send a confirmation/thank you email to the customer
    const confirmationEmail = `
      <div style="background-color: #000000; color: #ffffff; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; border: 1px solid #333333;">
        <h2 style="color: #f59e0b; text-align: center; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">Thank You for Contacting Us</h2>
        <p>Hello ${name},</p>
        <p>Thank you for reaching out to Fashion Store. We have received your message and will get back to you as soon as possible.</p>
        <p>For your records, here's a copy of your message:</p>
        <div style="background-color: #1a1a1a; padding: 15px; border-radius: 5px; margin-top: 15px; margin-bottom: 15px;">
          <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        <p>If you have any additional information to provide, please feel free to reply to this email.</p>
        <p>Regards,<br>The Fashion Store Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333333; text-align: center;">
          <p style="font-size: 12px; color: #666666;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Fashion Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank You for Contacting Fashion Store',
      html: confirmationEmail,
    });
    
    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!',
    });
    
  } catch (error) {
    console.error('Contact form email send error:', error);
    res.status(500);
    throw new Error('Failed to send your message. Please try again later.');
  }
});

export { sendContactEmail };