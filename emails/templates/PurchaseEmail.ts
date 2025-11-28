export const PURCHASE_EMAIL = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Litlyx plan has been upgraded</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9f9f9;">
  <table align="center" cellpadding="0" cellspacing="0" width="100%"
    style="max-width:600px; margin:auto; background-color:#ffffff; border-radius:8px;">
    <tr>
      <td align="center" style="padding: 40px 20px 10px;">
        <img
          src="data:image/png;base64,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"
          alt="" width="48px" height="48px">
        <h2 style="font-size:20px; color:#333333; margin:0;">Your plan has been upgraded.</h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 40px 30px; text-align: left; color: #4a4a4a; font-size: 16px;">
        <p style="font-size:16px; line-height:1.6; color:#484848;">
          Thanks for upgrading your Litlyx account! Your new plan is now active.
        </p>

        <p style="font-size:16px; line-height:1.6; color:#484848;">
          You can now access your dashboard, keep tracking your traffic, and get even more insights with no interruptions.
        </p>

         <p style="font-size:16px; line-height:1.6; color:#484848;">
          You can handle your plan and your invoices in our <a href="https://dashboard.litlyx.com/billing"
            style="color: #007BFF;">billing</a> page.
        </p>

        <a href="https://dashboard.litlyx.com/"
          style="display:block; background-color:#0a0a0a; color:#ffffff; text-align:center; border-radius:16px; text-decoration:none; font-size:14px; padding:16px; margin-top:20px; font-weight: bold;"
          target="_blank">
          Open your dashboard
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 40px; text-align: center; font-size: 12px; color: #777777;">
        <p style="margin-top: 10px;">2025 &copy; Litlyx - Analytics reimagined. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>

</html>
`