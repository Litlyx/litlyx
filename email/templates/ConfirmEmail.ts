
export const CONFIRM_EMAIL = `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }

        .container {
            background-color: #ffffff;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333333;
        }

        p {
            color: #555555;
            line-height: 1.5;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #0a0a0a;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }

        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777777;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Confirm your email on Litlyx</h2>
        <p>Hello,</p>
        <p>Thank you so much for signing up on Litlyx! Please confirm your email address by clicking the button below:
        </p>
        <p><a href="[CONFIRM_LINK]" class="button">Confirm Email</a></p>
        <p>If you didn't create an account with us, you can safely ignore this email.</p>
        <p>We hope to hear from you soon!</p>

        <div class="footer">
            <p>2025 &copy; Litlyx. All rights reserved.</p>
        </div>
    </div>
</body>

</html>`