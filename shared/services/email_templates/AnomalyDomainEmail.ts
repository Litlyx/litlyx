export const ANOMALY_DOMAIN_EMAIL = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>❗️ Anomaly detected by our AI</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

    <!-- Email Content -->

    <p>Dear User,</p>

    <p>We wanted to let you know that <strong>[Project Name]</strong> on <strong>Litlyx</strong> has an anomaly that our AI agent detected.</p>

    <p> <strong>Anomaly</strong>: Suspicious DNS </p>

    <p> Message: </p>

    <ul>
        [DNS_ENTRIES]
    </ul>

    <p> Date: [CURRENT_DATE] </p>

    <p> Are logging data in your project. Is that you? </p>

    <p>You can analyze a suspicious DNS on your Litlyx dashboard. Visit the Security tab to find out more.</p>

    <h3>What can I do?</h3>

    <p>To resolve this issue, you should reach out to the webmasters of the websites that have duplicated your content and request them to remove it or give you proper attribution (if available).</p>

    <p>You can also use <a href="https://www.whois.com/whois/" style="color: #D32F2F; text-decoration: none;">https://www.whois.com/whois/</a> to get the contact details of the webmaster or domain owner.</p>

    <p>If webmasters don't respond or cooperate, <strong>you can file a DMCA complaint here:</strong> <a href="https://support.google.com/legal/answer/3110420?hl=en" style="color: #D32F2F; text-decoration: none;">https://support.google.com/legal/answer/3110420?hl=en</a> <strong>with Google to request the removal of the duplicate content from their search results.</strong></p>

    <h3>Please refer to this for more information:</h3>

    <ul>
        <li><a href="https://support.google.com/legal/answer/3110420?hl=en&sjid=14235884554806745995-AP&authuser=2" style="color: #D32F2F; text-decoration: none;">Report Content for Legal Reasons</a></li>
        <li><a href="https://www.dmca.com/FAQ/How-can-I-get-a-webpage-removed-from-Google-search-results" style="color: #D32F2F; text-decoration: none;">How can I get a webpage removed from Google search results?</a></li>
    </ul>

    <p>Your safety is our main priority.</p>

    <p>Thank you for choosing Litlyx every day as your analytics tool!</p>

    <p>Antonio,</p>
    <p>CEO | Litlyx</p>

</body>
</html>
`