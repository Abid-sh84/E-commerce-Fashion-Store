import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmailConfig() {
  console.log('Testing email configuration...');
  console.log('----------------------------');
  
  console.log('Email Settings:');
  console.log('Host:', process.env.EMAIL_HOST || 'smtp.gmail.com');
  console.log('Port:', process.env.EMAIL_PORT || '465');
  console.log('Secure:', process.env.EMAIL_SECURE === 'true');
  console.log('User:', process.env.EMAIL_USER);
  console.log('From:', process.env.EMAIL_FROM || `"Test" <${process.env.EMAIL_USER}>`);
  console.log('----------------------------');

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '465'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true,
      logger: true
    });

    // Verify connection
    console.log('Verifying connection...');
    const connectionResult = await transporter.verify();
    console.log('Connection verified:', connectionResult);
    console.log('----------------------------');

    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email',
      text: 'If you can read this, your email configuration is working!',
      html: '<b>If you can read this, your email configuration is working!</b>'
    });

    console.log('Email sent!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('----------------------------');
    console.log('Test successful!');
    
  } catch (error) {
    console.error('Test failed with error:');
    console.error(error);
    
    console.log('----------------------------');
    console.log('Email troubleshooting tips:');
    console.log('1. Check if your Gmail account has 2FA enabled');
    console.log('2. If 2FA is enabled, make sure you\'re using an App Password');
    console.log('3. Check if "Less secure app access" setting is enabled (if not using App Password)');
    console.log('4. Make sure your Gmail account isn\'t blocked or restricted');
    console.log('5. Try creating a new App Password in your Google Account settings');
  }
}

// Run the test
testEmailConfig();
