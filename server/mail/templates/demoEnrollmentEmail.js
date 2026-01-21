exports.demoEnrollmentEmail = (
    firstName,
    courseName,
    courseDescription,
    instructorName,
    accessCode,
    expiryDate,
    whatYouWillLearn
) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Demo Access Details</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; color: #333333;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 560px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 32px 40px 24px; border-bottom: 1px solid #e5e5e5;">
                            <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">StudyNotion</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 32px 40px;">
                            <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #374151;">
                                Hi ${firstName},
                            </p>
                            
                            <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #374151;">
                                Your demo access has been activated. You now have 3 days to explore the course content.
                            </p>
                            
                            <!-- Access Code Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                                <tr>
                                    <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; text-align: center;">
                                        <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Access Code</p>
                                        <p style="margin: 0; font-size: 24px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 2px; color: #059669;">${accessCode}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Course Details -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                                <tr>
                                    <td style="background-color: #f9fafb; border-radius: 6px; padding: 20px;">
                                        <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Course</p>
                                        <p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #111827;">${courseName}</p>
                                        
                                        <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.5; color: #4b5563;">${courseDescription}</p>
                                        
                                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td style="width: 50%; padding-right: 10px;">
                                                    <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">Instructor</p>
                                                    <p style="margin: 0; font-size: 14px; color: #111827;">${instructorName}</p>
                                                </td>
                                                <td style="width: 50%; padding-left: 10px;">
                                                    <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">Access Expires</p>
                                                    <p style="margin: 0; font-size: 14px; color: #111827;">${expiryDate}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            ${whatYouWillLearn ? `
                            <!-- What You'll Learn -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                                <tr>
                                    <td style="border-left: 3px solid #059669; padding-left: 16px;">
                                        <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #111827;">What you'll learn</p>
                                        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4b5563;">${whatYouWillLearn}</p>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <a href="http://localhost:3000" style="display: inline-block; padding: 12px 28px; background-color: #111827; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 6px;">Start Learning</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Note -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 16px;">
                                        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #92400e;">
                                            <strong>Note:</strong> Your demo access is valid for 3 days. After that, you can purchase the full course to continue your learning journey.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; border-top: 1px solid #e5e5e5; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">
                                Questions? Just reply to this email.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                StudyNotion Team
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
                <!-- Footer Links -->
                <table role="presentation" style="width: 100%; max-width: 560px; border-collapse: collapse; margin-top: 20px;">
                    <tr>
                        <td align="center">
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                You're receiving this because you signed up for a demo class.
                            </p>
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
    </table>
</body>
</html>`;
};
