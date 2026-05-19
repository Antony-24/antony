<?php
// Allow cross-origin requests for testing and separate server architectures
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit;
}

// Retrieve and sanitize inputs
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$number = isset($_POST['number']) ? strip_tags(trim($_POST['number'])) : 'Not provided';
$service = isset($_POST['service']) ? strip_tags(trim($_POST['service'])) : 'Not specified';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

// Server-side validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email address."]);
    exit;
}

// Recipient email
$to = "555jinson@gmail.com";

// Email Subject
$subject = "New Portfolio Inquiry from $name";

// HTML Email Template Design
$email_content = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Portfolio Inquiry</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #0d0d0e;
            color: #e4e4e7;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #151518;
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid #27272a;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }
        .header {
            background: linear-gradient(135deg, #44443a 0%, #2b2b24 100%);
            padding: 35px 30px;
            text-align: center;
            border-bottom: 1px solid #27272a;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .header p {
            color: rgba(255, 255, 255, 0.7);
            margin: 8px 0 0 0;
            font-size: 14px;
        }
        .content {
            padding: 40px 35px;
        }
        .field-group {
            margin-bottom: 28px;
            border-bottom: 1px solid #222225;
            padding-bottom: 18px;
        }
        .field-group:last-child {
            margin-bottom: 0;
            border-bottom: none;
            padding-bottom: 0;
        }
        .label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #71717a;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .value {
            font-size: 16px;
            color: #f4f4f5;
            line-height: 1.6;
        }
        .value a {
            color: #8f8f7c;
            text-decoration: none;
            border-bottom: 1px dashed #8f8f7c;
        }
        .value a:hover {
            color: #ffffff;
            border-bottom: 1px solid #ffffff;
        }
        .footer {
            background: #0a0a0b;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #52525b;
            border-top: 1px solid #222225;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Portfolio Inquiry</h1>
            <p>A user submitted a contact form on your portfolio website</p>
        </div>
        <div class="content">
            <div class="field-group">
                <div class="label">Name</div>
                <div class="value">' . htmlspecialchars($name) . '</div>
            </div>
            <div class="field-group">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:' . urlencode($email) . '">' . htmlspecialchars($email) . '</a></div>
            </div>
            <div class="field-group">
                <div class="label">Phone Number</div>
                <div class="value">' . htmlspecialchars($number) . '</div>
            </div>
            <div class="field-group">
                <div class="label">Service Required</div>
                <div class="value">' . htmlspecialchars($service) . '</div>
            </div>
            <div class="field-group">
                <div class="label">Requirements / Message</div>
                <div class="value" style="white-space: pre-line;">' . htmlspecialchars($message) . '</div>
            </div>
        </div>
        <div class="footer">
            Sent securely via Antony Portfolio Contact Handler
        </div>
    </div>
</body>
</html>
';

// Setup dynamic and SPF-compliant From headers
$host = $_SERVER['HTTP_HOST'];
if (empty($host) || $host === 'localhost' || preg_match('/:\d+$/', $host)) {
    $host = 'antonyfrancis.com'; // fallback for local environment or custom port testing
}
$host = preg_replace('/^www\./', '', $host);

$from_email = "noreply@" . $host;
$from_name = "Antony Portfolio";

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: $from_name <$from_email>" . "\r\n";
$headers .= "Reply-To: $name <$email>" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Execute email send
if (mail($to, $subject, $email_content, $headers)) {
    echo json_encode(["success" => true, "message" => "Your message has been sent successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Unable to send mail. Please verify PHP mail() is configured on your server."]);
}
?>
