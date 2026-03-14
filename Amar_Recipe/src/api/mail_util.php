<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config.php';

/**
 * Send an email using PHPMailer
 * 
 * @param string $to Recipient email
 * @param string $subject Email subject
 * @param string $body Email HTML body
 * @return bool True if success, False otherwise
 */
function sendEmail($to, $subject, $body) {
    if (empty($to)) return false;

    $mail = new PHPMailer(true);

    try {
        // Server settings
        if (defined('SMTP_DEBUG') && SMTP_DEBUG) {
            $mail->SMTPDebug = 2; 
            $mail->Debugoutput = function($str, $level) {
                error_log("SMTP DEBUG: $str");
            };
        }
        $mail->isSMTP();
        
        // Render/Cloud Fix: Force IPv4 to avoid 'Network is unreachable' (ENETUNREACH)
        // Some nodes have issues with IPv6 mail routing
        $mail->Host = gethostbyname(SMTP_HOST); 
        if ($mail->Host === SMTP_HOST) {
            // If gethostbyname failed or returned the same, use default but it might fail
            $mail->Host = SMTP_HOST;
        }
        
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        
        // Use SMTPS (Implicit SSL) for port 465, STARTTLS for 587
        if (SMTP_PORT == 465) {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } else {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        }
        
        $mail->Port       = SMTP_PORT;

        // SSL Options to bypass common local/cloud verification issues
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );

        // Recipients
        $mail->setFrom(SMTP_USER, SMTP_FROM_NAME);
        $mail->addAddress($to);
        $mail->addReplyTo(SMTP_FROM_EMAIL, SMTP_FROM_NAME);

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->CharSet = 'UTF-8';

        $mail->send();
        error_log("Email sent successfully to $to");
        return true;
    } catch (Exception $e) {
        $errorMsg = "PHPMailer Error: " . $mail->ErrorInfo . " (Exception: " . $e->getMessage() . ")";
        error_log($errorMsg);
        return $errorMsg; // Return the specific error for debugging
    }
}

/**
 * Send Verification Email for Rating
 */
function sendRatingVerification($email, $recipeTitle, $token) {
    $verifyUrl = API_BASE_URL . "verify_email.php?type=rating&token=" . urlencode($token);
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
    $verifyUrl = API_BASE_URL . "verify_email.php?type=submission&token=" . urlencode($token);
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
