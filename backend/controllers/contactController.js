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
    
    // Format the email content
    const emailContent = `
      <div style="background-color: #1a104d; color: #e9e9ff; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif;">
        <h2 style="color: #ffc107; text-align: center; margin-bottom: 20px;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
        <h3 style="color: #ffc107; margin-top: 20px;">Message:</h3>
        <p style="background-color: #2c2157; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
        <p style="font-size: 12px; margin-top: 30px; color: #aaa;">This message was sent from the contact form on your website.</p>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Contact Form" <${process.env.EMAIL_USER}>`,
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
      <div style="background-color: #1a104d; color: #e9e9ff; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif;">
        <h2 style="color: #ffc107; text-align: center; margin-bottom: 20px;">Thank You for Contacting Us</h2>
        <p>Hello ${name},</p>
        <p>Thank you for reaching out to Starry Comics. We have received your message and will get back to you as soon as possible.</p>
        <p>For your records, here's a copy of your message:</p>
        <div style="background-color: #2c2157; padding: 15px; border-radius: 5px; margin-top: 15px; margin-bottom: 15px;">
          <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        <p>If you have any additional information to provide, please feel free to reply to this email.</p>
        <p>Regards,<br>The Starry Comics Team</p>
      </div>
    `;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Starry Comics" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank You for Contacting Starry Comics',
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