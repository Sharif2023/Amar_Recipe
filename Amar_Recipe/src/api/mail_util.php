<?php
require_once __DIR__ . '/config.php';

/**
 * Send an email using Brevo API (primary) or Resend API (fallback)
 * 
 * @param string $to Recipient email
 * @param string $subject Email subject
 * @param string $body Email HTML body
 * @return bool|string True if success, Error message string otherwise
 */
function sendEmail($to, $subject, $body) {
    if (empty($to)) return "Recipient email is empty";

    // 1. Prefer Brevo API if configured
    if (!empty(BREVO_API_KEY)) {
        return sendViaBrevo($to, $subject, $body);
    }

    // 2. Fallback to Resend API
    if (!empty(RESEND_API_KEY) && strpos(RESEND_API_KEY, 're_') === 0) {
        return sendViaResend($to, $subject, $body);
    }

    return "No email API configured. Please set BREVO_API_KEY in your environment variables.";
}

/**
 * Send email via Brevo REST API (HTTPS port 443 - works on Render)
 */
function sendViaBrevo($to, $subject, $body) {
    $url = 'https://api.brevo.com/v3/smtp/email';
    $senderEmail = defined('BREVO_SENDER_EMAIL') && BREVO_SENDER_EMAIL ? BREVO_SENDER_EMAIL : (defined('ADMIN_EMAIL') ? ADMIN_EMAIL : 'sharifislam0505@gmail.com');
    $senderName = defined('SMTP_FROM_NAME') ? SMTP_FROM_NAME : 'Amar Recipe';

    $payload = [
        'sender' => [
            'name' => $senderName,
            'email' => $senderEmail,
        ],
        'to' => [
            [
                'email' => $to,
            ]
        ],
        'subject' => $subject,
        'htmlContent' => $body,
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'accept: application/json',
        'api-key: ' . BREVO_API_KEY,
        'content-type: application/json',
    ]);
    
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        $errorMsg = "Brevo cURL Error: " . $error;
        error_log($errorMsg);
        return $errorMsg;
    }

    if ($httpCode >= 200 && $httpCode < 300) {
        error_log("Email sent successfully to $to via Brevo API");
        return true;
    } else {
        $errorMsg = "Brevo API Error (HTTP $httpCode): " . $response;
        error_log($errorMsg);
        return $errorMsg;
    }
}

/**
 * Send email via Resend API
 */
function sendViaResend($to, $subject, $body) {
    $url = 'https://api.resend.com/emails';
    
    $payload = [
        'from' => SMTP_FROM_NAME . ' <' . SMTP_FROM_EMAIL . '>',
        'to' => [$to],
        'subject' => $subject,
        'html' => $body,
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . RESEND_API_KEY,
        'Content-Type: application/json',
    ]);
    
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        $errorMsg = "cURL Error: " . $error;
        error_log($errorMsg);
        return $errorMsg;
    }

    if ($httpCode >= 200 && $httpCode < 300) {
        error_log("Email sent successfully to $to via Resend API");
        return true;
    } else {
        $errorMsg = "Resend API Error (HTTP $httpCode): " . $response;
        if ($httpCode == 403 && strpos($response, 'validation_error') !== false) {
            $errorMsg = "Resend API Error (403): You can only send emails to your own email address because your domain is not verified. To send to other emails, please verify your domain at Resend.com.";
        }
        error_log($errorMsg);
        return $errorMsg;
    }
}

/**
 * Send Verification Email for Rating
 */
function sendRatingVerification($email, $recipeTitle, $token) {
    $verifyUrl = FRONTEND_URL . "verify-email?type=rating&token=" . urlencode($token);
    $subject = "রেসিপি রেটিং যাচাই করুন - " . $recipeTitle;
    $body = "
        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
            <h2 style='color: #e11d48;'>Amar Recipe</h2>
            <p>আপনি <strong>{$recipeTitle}</strong> রেসিপিটিতে একটি রেটিং দিয়েছেন। আপনার রেটিংটি রেসিপিতে যুক্ত করতে নিচের লিঙ্কে ক্লিক করে ইমেইলটি যাচাই করুন:</p>
            <div style='margin: 30px 0;'>
                <a href='{$verifyUrl}' style='background-color: #e11d48; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;'>ইমেইল যাচাই করুন</a>
            </div>
            <p style='color: #666; font-size: 12px;'>যদি আপনি এই রেটিং না দিয়ে থাকেন, তবে এই ইমেইলটি উপেক্ষা করুন।</p>
        </div>
    ";
    return sendEmail($email, $subject, $body);
}

/**
 * Send Verification Email for Recipe Submission
 */
function sendSubmissionVerification($email, $recipeTitle, $token) {
    $verifyUrl = FRONTEND_URL . "verify-email?type=submission&token=" . urlencode($token);
    $subject = "রেসিপি জমা যাচাই করুন - " . $recipeTitle;
    $body = "
        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
            <h2 style='color: #e11d48;'>Amar Recipe</h2>
            <p>আপনি <strong>{$recipeTitle}</strong> নামে একটি রেসিপি জমা দিয়েছেন। আপনার আবেদনটি অ্যাডমিন রিভিউতে পাঠাতে ইমেইলটি যাচাই করা প্রয়োজন:</p>
            <div style='margin: 30px 0;'>
                <a href='{$verifyUrl}' style='background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;'>জমা দেওয়া যাচাই করুন</a>
            </div>
            <p style='color: #666; font-size: 12px;'>ইমেইল যাচাই করার পর আমাদের অ্যাডমিন এটি পরীক্ষা করে দেখবেন।</p>
        </div>
    ";
    return sendEmail($email, $subject, $body);
}

/**
 * Send Notification Email for Recipe Update/Edit
 */
function sendRecipeEditNotification($email, $recipeTitle, $message) {
    $subject = "আপনার রেসিপিটি আপডেট করা হয়েছে - " . $recipeTitle;
    $body = "
        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
            <h2 style='color: #e11d48;'>Amar Recipe</h2>
            <p>আপনার <strong>{$recipeTitle}</strong> রেসিপিটিতে অ্যাডমিন কিছু পরিবর্তন করেছেন:</p>
            <div style='background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                <p style='margin: 0; color: #374151;'>{$message}</p>
            </div>
            <p>সংশোধিত রেসিপিটি এখন আমাদের ওয়েবসাইটে দেখা যাবে। ধন্যবাদ আমাদের সাথে থাকার জন্য।</p>
        </div>
    ";
    return sendEmail($email, $subject, $body);
}

/**
 * Send Notification Email for Recipe Approval
 */
function sendRecipeApprovalNotification($email, $recipeTitle) {
    $subject = "আপনার রেসিপিটি অনুমোদিত হয়েছে! - " . $recipeTitle;
    $body = "
        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
            <h2 style='color: #e11d48;'>Amar Recipe</h2>
            <p>অভিনন্দন! আপনার জমা দেওয়া রেসিপি <strong>{$recipeTitle}</strong> অ্যাডমিন কর্তৃক অনুমোদিত হয়েছে এবং এটি এখন ওয়েবসাইটে লাইভ।</p>
            <p>আপনার রান্নার প্রতিভা সবার সাথে শেয়ার করার জন্য ধন্যবাদ।</p>
        </div>
    ";
    return sendEmail($email, $subject, $body);
}

/**
 * Send Notification Email for Recipe Rejection/Decline
 */
function sendRecipeDeclineNotification($email, $recipeTitle, $reason) {
    $subject = "আপনার রেসিপি জমা দেওয়ার আবেদনটি গ্রহণ করা হয়নি - " . $recipeTitle;
    $reason_text = !empty($reason) ? $reason : "দুঃখিত, আপনার রেসিপিটি আমাদের নীতিমালা অনুসরণ না করায় গ্রহণ করা সম্ভব হয়নি।";
    $body = "
        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
            <h2 style='color: #e11d48;'>Amar Recipe</h2>
            <p>আপনার <strong>{$recipeTitle}</strong> রেসিপিটি আমাদের অ্যাডমিন রিভিউ করেছেন।</p>
            <div style='background-color: #fef2f2; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #e11d48;'>
                <p style='margin: 0; color: #991b1b;'><strong>কারন:</strong> {$reason_text}</p>
            </div>
            <p>আপনি আপনার রেসিপিটি সংশোধন করে পুনরায় জমা দিতে পারেন। ধন্যবাদ।</p>
        </div>
    ";
    return sendEmail($email, $subject, $body);
}

function sendUserSignupVerification($email, $name, $token) {
    $verifyUrl = FRONTEND_URL . "verify-email?type=user&token=" . urlencode($token);
    $safeName = htmlspecialchars($name ?: 'there', ENT_QUOTES, 'UTF-8');
    $subject = "আপনার অ্যাকাউন্ট যাচাই করুন - Amar Recipe";
    $body = "
        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
            <h2 style='color: #e11d48;'>Amar Recipe</h2>
            <p>হ্যালো {$safeName},</p>
            <p>আপনার অ্যাকাউন্ট চালু করতে ইমেইল যাচাই করুন। যাচাইয়ের পর আপনি লগইন করে রেসিপি সাবমিশন, অনুমোদন/রিজেক্ট এবং রেটিং ট্র্যাক করতে পারবেন।</p>
            <div style='margin: 30px 0;'>
                <a href='{$verifyUrl}' style='background-color: #e11d48; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;'>ইমেইল যাচাই করুন</a>
            </div>
            <p style='color: #666; font-size: 12px;'>যদি আপনি এই অ্যাকাউন্ট না খুলে থাকেন, তবে এই ইমেইলটি উপেক্ষা করুন।</p>
        </div>
    ";
    return sendEmail($email, $subject, $body);
}
