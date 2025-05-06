import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmailDirectly() {
  console.log('Testing Gmail credentials directly...');
  console.log('----------------------------');
  
  console.log('Email Settings:');
  console.log('Host:', process.env.EMAIL_HOST);
  console.log('Port:', process.env.EMAIL_PORT);
  console.log('Secure:', process.env.EMAIL_SECURE);
  console.log('User:', process.env.EMAIL_USER);
  console.log('From:', process.env.EMAIL_FROM);
  console.log('----------------------------');

  try {
    // Create transporter with Gmail specific config
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, 
      }
    });

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Direct Gmail Test',
      text: 'This is a direct test of Gmail credentials.',
      html: '<b>This is a direct test of Gmail credentials.</b>'
    });

    console.log('Email sent!');
    console.log('Message ID:', info.messageId);
    console.log('----------------------------');
    console.log('Test successful!');
  } catch (error) {
    console.error('Test failed with error:');
    console.error(error);
    
    console.log('----------------------------');
    console.log('Gmail troubleshooting tips:');
    console.log('1. Make sure 2FA is enabled in your Google account');
    console.log('2. Ensure you\'re using an App Password (not your regular password)');
    console.log('3. Generate a new App Password in your Google Account');
    console.log('   (Google Account → Security → 2-Step Verification → App passwords)');
    console.log('4. Check if your Google Account has any security restrictions');
    console.log('5. Make sure "Less secure app access" is turned ON if not using App Passwords');
  }
}

// Run the test
testEmailDirectly();
