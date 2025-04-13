export const CONTACT_THANK_YOU_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Thank You</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }
    
    table, td {
      border-collapse: collapse;
    }
    
    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }
    
    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }
    
    .button {
      width: 100%;
      background: #22D172;
      text-decoration: none;
      display: inline-block;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }
    
    .visit-button {
      display: inline-block;
      background-color: #4C83EE;
      color: #ffffff;
      text-decoration: none;
      font-weight: bold;
      padding: 12px 24px;
      border-radius: 5px;
      margin: 20px 0;
      text-align: center;
    }
    
    .footer {
      font-size: 12px;
      color: #666666;
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #E5E5E5;
      margin-top: 20px;
    }
    
    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }
      
      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                          Thank you for contacting us!
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          Hello <span style="color: #4C83EE;">{{name}}</span>,
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%;">
                          We have received your message and appreciate you reaching out to us. A member of our team will get back to you shortly.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 24px;">
                          <p style="margin: 0; font-size: 14px; line-height: 150%;">
                            In the meantime, feel free to explore our website to learn more about the Ice Stupa Project and our initiatives.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <a href="https://ice-stupa-dashboard.vercel.app/" class="visit-button" target="_blank">
                            Visit Our Website
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0 0; font-size: 14px; line-height: 150%; font-style: italic;">
                          We'll be in touch soon!
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0 0; font-size: 14px; line-height: 150%; font-weight: bold;">
                          - The Ice Stupa Project Team
                          <br><br>

                        </td>
                      </tr>
                      <tr>
                        <td class="footer">
                          <p>© 2025 Ice Stupa Project. All rights reserved.</p>
                        </td>
                        
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;

// Notification email template for the owner with form details
export const CONTACT_OWNER_NOTIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>New Contact Form Submission</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }
    
    table, td {
      border-collapse: collapse;
    }
    
    .container {
      width: 100%;
      max-width: 600px;
      margin: 70px 0px;
      background-color: #ffffff;
    }
    
    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }
    
    .detail-row {
      padding: 10px 0;
      border-bottom: 1px solid #E5E5E5;
    }
    
    .detail-label {
      color: #666666;
      font-weight: 600;
    }
    
    .detail-value {
      padding-top: 5px;
    }
    
    .message-container {
      background-color: #F6FAFB;
      border-radius: 8px;
      padding: 15px;
      margin-top: 10px;
    }
    
    @media only screen and (max-width: 480px) {
      .container {
        width: 90% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold; color: #4C83EE;">
                          New Contact Form Submission
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 20px; font-size: 14px; line-height: 150%;">
                          You have received a new message from the contact form on the Ice Stupa Project website.
                        </td>
                      </tr>
                      
                      <!-- Contact Details -->
                      <tr>
                        <td>
                          <table width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tbody>
                              <tr>
                                <td class="detail-row">
                                  <div class="detail-label">Name:</div>
                                  <div class="detail-value">{{name}}</div>
                                </td>
                              </tr>
                              <tr>
                                <td class="detail-row">
                                  <div class="detail-label">Email:</div>
                                  <div class="detail-value">{{email}}</div>
                                </td>
                              </tr>
                              <tr>
                                <td class="detail-row">
                                  <div class="detail-label">Subject:</div>
                                  <div class="detail-value">{{subject}}</div>
                                </td>
                              </tr>
                              <tr>
                                <td class="detail-row">
                                  <div class="detail-label">Date Submitted:</div>
                                  <div class="detail-value">{{date}}</div>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-top: 20px;">
                                  <div class="detail-label">Message:</div>
                                  <div class="message-container">
                                    {{message}}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                 
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;
