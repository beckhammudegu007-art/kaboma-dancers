<?php
/**
 * Kaboma Dancers - Contact Form Handler
 * Processes booking requests and sends email notifications
 */

// Configuration
$toEmail = 'kabomadancers@gmail.com';
$subjectPrefix = 'Kaboma Dancers - New Booking Request';
$allowedServices = ['live-performance', 'workshop', 'photo-session', 'private-event', 'corporate', 'wedding', 'other'];
$allowedTimes = ['morning', 'afternoon', 'evening', 'flexible'];
$allowedDurations = ['30-min', '1-hour', '2-hours', '3-hours', 'half-day', 'full-day'];

// Response array
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

// Function to sanitize input
function sanitize($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Get form data
    $firstName = isset($_POST['firstName']) ? sanitize($_POST['firstName']) : '';
    $lastName = isset($_POST['lastName']) ? sanitize($_POST['lastName']) : '';
    $email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? sanitize($_POST['phone']) : '';
    $service = isset($_POST['service']) ? sanitize($_POST['service']) : '';
    $eventDate = isset($_POST['eventDate']) ? sanitize($_POST['eventDate']) : '';
    $eventTime = isset($_POST['eventTime']) ? sanitize($_POST['eventTime']) : '';
    $duration = isset($_POST['duration']) ? sanitize($_POST['duration']) : '';
    $guests = isset($_POST['guests']) ? sanitize($_POST['guests']) : '';
    $location = isset($_POST['location']) ? sanitize($_POST['location']) : '';
    $specialRequirements = isset($_POST['specialRequirements']) ? sanitize($_POST['specialRequirements']) : '';
    $message = isset($_POST['message']) ? sanitize($_POST['message']) : '';
    $newsletter = isset($_POST['newsletter']) ? true : false;
    
    // Validate required fields
    if (empty($firstName)) {
        $response['errors'][] = 'First name is required';
    }
    if (empty($lastName)) {
        $response['errors'][] = 'Last name is required';
    }
    if (empty($email)) {
        $response['errors'][] = 'Email address is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors'][] = 'Invalid email address';
    }
    if (empty($phone)) {
        $response['errors'][] = 'Phone number is required';
    }
    if (empty($service)) {
        $response['errors'][] = 'Please select a service';
    } elseif (!in_array($service, $allowedServices)) {
        $response['errors'][] = 'Invalid service selection';
    }
    if (empty($eventDate)) {
        $response['errors'][] = 'Event date is required';
    }
    if (empty($message)) {
        $response['errors'][] = 'Message is required';
    }
    
    // Validate optional fields
    if (!empty($eventTime) && !in_array($eventTime, $allowedTimes)) {
        $response['errors'][] = 'Invalid time selection';
    }
    if (!empty($duration) && !in_array($duration, $allowedDurations)) {
        $response['errors'][] = 'Invalid duration selection';
    }
    if (!empty($guests) && !is_numeric($guests)) {
        $response['errors'][] = 'Number of guests must be a number';
    }
    
    // If no errors, process the form
    if (empty($response['errors'])) {
        
        // Prepare email to site owner
        $serviceLabels = [
            'live-performance' => 'Live Dance Performance',
            'workshop' => 'Dance Workshop',
            'photo-session' => 'Photo/Video Session',
            'private-event' => 'Private Event',
            'corporate' => 'Corporate Event',
            'wedding' => 'Wedding Performance',
            'other' => 'Other'
        ];
        
        $timeLabels = [
            'morning' => 'Morning (8AM - 12PM)',
            'afternoon' => 'Afternoon (12PM - 5PM)',
            'evening' => 'Evening (5PM - 9PM)',
            'flexible' => 'Flexible / Anytime'
        ];
        
        $durationLabels = [
            '30-min' => '30 minutes',
            '1-hour' => '1 hour',
            '2-hours' => '2 hours',
            '3-hours' => '3 hours',
            'half-day' => 'Half Day',
            'full-day' => 'Full Day'
        ];
        
        $emailSubject = "$subjectPrefix from $firstName $lastName";
        
        $emailBody = "
<html>
<head>
    <title>New Booking Request - Kaboma Dancers</title>
</head>
<body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">
    <div style=\"max-width: 600px; margin: 0 auto; padding: 20px;\">
        <h2 style=\"color: #c41e3a;\">New Booking Request</h2>
        <p><strong>Name:</strong> $firstName $lastName</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        
        <h3 style=\"color: #c41e3a; margin-top: 20px;\">Event Details</h3>
        <p><strong>Service:</strong> " . $serviceLabels[$service] . "</p>
        <p><strong>Preferred Date:</strong> $eventDate</p>
        <p><strong>Preferred Time:</strong> " . ($eventTime ? $timeLabels[$eventTime] : 'Not specified') . "</p>
        <p><strong>Duration:</strong> " . ($duration ? $durationLabels[$duration] : 'Not specified') . "</p>
        <p><strong>Number of Guests:</strong> " . ($guests ? $guests : 'Not specified') . "</p>
        <p><strong>Location:</strong> " . ($location ? $location : 'Not specified') . "</p>
        
        " . ($specialRequirements ? "<p><strong>Special Requirements:</strong> $specialRequirements</p>" : "") . "
        
        <h3 style=\"color: #c41e3a; margin-top: 20px;\">Additional Message</h3>
        <p>$message</p>
        
        <p style=\"margin-top: 30px; font-size: 12px; color: #666;\">
            This message was sent from the Kaboma Dancers website contact form.
        </p>
    </div>
</body>
</html>
";
        
        // Email headers
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: $email" . "\r\n";
        $headers .= "Reply-To: $email" . "\r\n";
        
        // Send email to site owner
        if (mail($toEmail, $emailSubject, $emailBody, $headers)) {
            
            // Send confirmation email to customer
            $confirmationSubject = "Booking Request Received - Kaboma Dancers";
            $confirmationBody = "
<html>
<head>
    <title>Booking Request Received - Kaboma Dancers</title>
</head>
<body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">
    <div style=\"max-width: 600px; margin: 0 auto; padding: 20px;\">
        <h2 style=\"color: #c41e3a;\">Thank You for Your Booking Request!</h2>
        
        <p>Dear $firstName,</p>
        
        <p>We have received your booking request for <strong>" . $serviceLabels[$service] . "</strong> on <strong>$eventDate</strong>.</p>
        
        <p>Our team will review your request and get back to you within <strong>24 hours</strong> with a confirmation and more details.</p>
        
        <h3 style=\"color: #c41e3a; margin-top: 20px;\">Your Request Summary</h3>
        <p><strong>Service:</strong> " . $serviceLabels[$service] . "</p>
        <p><strong>Date:</strong> $eventDate</p>
        <p><strong>Time:</strong> " . ($eventTime ? $timeLabels[$eventTime] : 'Not specified') . "</p>
        
        <p style=\"margin-top: 30px;\">If you have any urgent inquiries, please call us directly.</p>
        
        <p style=\"margin-top: 30px;\">Warm regards,<br>
        <strong>The Kaboma Dancers Team</strong></p>
        
        <hr style=\"margin-top: 30px; border: none; border-top: 1px solid #ddd;\">
        <p style=\"font-size: 12px; color: #666;\">
            Kaboma Dancers - Authentic Kenyan Dance Company<br>
            Email: $toEmail
        </p>
    </div>
</body>
</html>
";
            
            $confirmationHeaders = "MIME-Version: 1.0" . "\r\n";
            $confirmationHeaders .= "Content-type:text/html;charset=UTF-8" . "\r\n";
            $confirmationHeaders .= "From: Kaboma Dancers <$toEmail>" . "\r\n";
            
            // Send confirmation email (don't fail if this doesn't go through)
            mail($email, $confirmationSubject, $confirmationBody, $confirmationHeaders);
            
            $response['success'] = true;
            $response['message'] = 'Thank you for your booking request! We have received your inquiry and will get back to you within 24 hours.';
            
        } else {
            $response['message'] = 'Sorry, there was an error sending your message. Please try again or contact us directly by phone.';
        }
    } else {
        $response['message'] = 'Please correct the following errors:';
    }
    
} else {
    $response['message'] = 'Invalid request method';
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
exit;
