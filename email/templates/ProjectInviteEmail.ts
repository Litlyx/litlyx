export const PROJECT_INVITE_EMAIL = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f9fafb;
            font-family: Arial, sans-serif;
            margin: 0;
        }

        .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
        }

        .icon {
            font-size: 24px;
            margin-bottom: 15px;
        }

        h2 {
            margin-bottom: 10px;
            color: #1f2937;
        }

        p {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 20px;
        }

        .confirm-btn {
            background: black;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
        }

        .confirm-btn:hover {
            opacity: 0.9;
        }

        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #9ca3af;
        }

        .brand {
            font-weight: bold;
            color: #facc15;
        }

        .close-btn {
            margin-top: 15px;
            font-size: 18px;
            cursor: pointer;
            color: #6b7280;
        }
    </style>
</head>

<body>
    <div class="container">
        <img class="icon"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAP0SURBVHgB7Zy9ixNBGMZfPwor8xecf8EFrE3Awi6CfQ7sFay9wvoOzlpBa8XrD7QPxM5COK0Pzj5gaec+ZF7yZt3NzmY/ZmZ9fjDsxsyeME/ej5l5Z0UIIYQQQgghhBBCCCGEEEIIIYQQMmQusnZPSDSsXDsWEgUr075LwtZyU9JnlPsMMeDCHgsJAgSw1mGt5Zkkxi1Jn3HW5u7+LGvfsjZ1nx+561chvTGTjUWomzqWxC0lZTDYOvBT8+9Hsi3KkZBesNaQz66em++uZO3eSMe8lc2gF2EFSzolTgWkuDrYZZzKRpQLIZ2yEL+BVuEY5DtGB/m0oh9c1ZXpH2U8SX2mbgf1uqIvvn9qPr+RCEldkANz/8Oj/zJr79w9xORiZMvYYD3yfAb91HXhGlXWlbqFHLrrZdZ+ez6Dfq/cPcR5KaQ19Jf+Uepjsy5OGFsAg9hkWWQqEc5NUnZZE3N/KfVZugYgThSxJGVBZu6KdHYfQcBrcz8X0gh1N/vED4vGEsQj30ytM1K1kJm5/yLN0OchRnArGYIgS2nGuWxS5pmQvdC984W0g02Bg7qtFC0Ev2LNiM6lHezfCeq2UhVEaRo/iv7OVIg3tuSnLXel2GwrGLclLexk8L3UB4KOZDtOXLuGUqGp+w6rAPvObRqRmiC6XI4B/OTRHwM8cQ2DvCtg28VJ9KcgFSDY+gbzuWt14oEVK9hi4w1JA63XxRXWcb+kHwQ4kX8HFL/+z1n76Z631gAhDl0bu/8D1vFQSCnYbq1a2bWbVdpQIlQ3a+JOYgW2rqpomXwk2xM7Xd9i/VUH2LrdoiI3iLGQ7epEHkPoCLgOW7ZT5KqsGKxK7BAUslkxiny6jRkQJvjS+RBBAM7HgyIxbMX7oMQImfaqC7or65Qzv42K1PSFrNNVC/qoCEhhn0h1kRzxYFXS4KpgFWW/ep8UmOxBXgS4Kpzn2OV+8ucJSYvoJlOdPXE7JxmkdYTcD9Hli4Maz+jmke/iYnKEFESLo33nDmPTt62NqegIKYgubyNm+Kw3HZp7CtIB9vjAxKO/XcFtWmlCSrDHAqrQCWPbW7dREbrIQQ/P+LgtjR++xw6SJAZBdICjPGLWN6EFgRhqJbAAno6NALgrnSTuettC29WKZAf28EzZvsYHiaBuqmtiqVxEGnvm7m1Bg+WXu46EG1G9YVdyYSk285qb73i4pkesKLpBpdWG0Z0J/F/Iv4AM1gKriOq0UxfE+oo/1NkiZmD9Sq0D1SQaO+5k7Y/w1X29AwHy1mI3tVjYEAgIgw2p/FtHT2RgpFLba8HEEdnXA1kLhUKIIJXqhBBCCCGEEEIIIYQQQgghhBBCCOmPv8OsFHqaHzwyAAAAAElFTkSuQmCC"
            alt="litlyx-logo">

        <h2>You're invited to the Litlyx project [Project Name]!</h2>
        <p>Join now by clicking the button below.</p>
        <a href="[Link]" class="confirm-btn">
            Join the Project
        </a>
        <p class="footer">See you there,<br> The <span class="brand">Litlyx</span> Team</p>
        <p class="footer">If you need any help feel free to reach out at help@litlyx.com.</p>
        <p class="footer">Litlyx Srl<br>Viale Tirreno 187<br>Rome, 00141</p>

    </div>

    <script>
        function confirmEmail() {
            alert("Email confirmed! Thank you for joining the waitlist.");
        }
    </script>
</body>

</html>`