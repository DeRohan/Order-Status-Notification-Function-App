const { app } = require('@azure/functions');
const sendGridMail = require('@sendgrid/mail');

// Set your SendGrid API key
sendGridMail.setApiKey('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');  // Replace with your actual SendGrid API key

app.http('OrderStatusNotification', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`HTTP function processed a request for URL "${request.url}"`);
        context.log('Received Request!');
        
        const body = await request.json();
        const { order_id, new_status, customerEmail } = body;

        if (!order_id || !new_status || !customerEmail) {
            context.log.error('Missing required fields in request body.');
            return {
                status: 400,
                body: "Please provide 'order_id', 'new_status', and 'customerEmail'."
            };
        }

        context.log(`Order #${order_id} updated to status: ${new_status}`);
        console.log(order_id, new_status, customerEmail)
        // Prepare the email content
        const notificationMessage = `Your order #${order_id} is now ${new_status}.`;

        // Prepare email data
        const emailData = {
            to: customerEmail,
            from: 'sahilkukreja4696@gmail.com',  // Use your email or a verified sender email
            subject: `Order #${order_id} Status Update`,
            text: notificationMessage,
            html: `<p>${notificationMessage}</p>`,
        };
        console.log(emailData)
        try {
            // Send the email
            await sendGridMail.send(emailData);
            context.log(`Notification sent to ${customerEmail}`);

            return {
                status: 200,
                body: `Order status updated and notification sent to ${customerEmail} successfully.`
            };
        } catch (error) {
            context.log.error('Error sending email:', error);
            return {
                status: 500,
                body: 'Error sending email notification.'
            };
        }
    }
});