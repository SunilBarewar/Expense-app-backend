const createHtmlContentForMail = (link) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style> 
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
                color: #333;
            }
    
            p {
                font-size: 16px;
                line-height: 1.5;
                color: #666;
            }
    
            .reset-button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #0073e6;
                border-radius: 5px;
                text-align: center;
                text-transform: uppercase;
                margin-top: 20px;
                text-decoration: none;
            }
            .reset-button span{
                color : white;
                font-weight:500;
            }
            .footer {
                margin-top: 20px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Reset Your Password</h1>
            <p>We've received a request to reset your password for your Expense Tracky account. To do so, please click the link below:</p>
            <a class="reset-button" href="${link}"><span>Reset Password<span></a>
            <p><strong>Note:</strong> This link will expire in 10 minutes.</p>
            <p>If you did not request this password reset, please disregard this email. Your account security is important to us, and no changes will be made without your confirmation.</p>
            <p>To ensure your account's safety, we recommend creating a strong, unique password. It should be at least 8 characters long, containing a combination of letters (both upper and lower case), numbers, and special characters.</p>
            <p>Thank you for using Expense Tracky. If you encounter any issues or have any questions, please don't hesitate to contact our support team at help@expensetracky.com</p>
        </div>
        <p class="footer">Best regards,<br>Sunil Barewar<br>Manage expense</p>
    </body>
    </html>
    
    `;
};

module.exports = createHtmlContentForMail;
