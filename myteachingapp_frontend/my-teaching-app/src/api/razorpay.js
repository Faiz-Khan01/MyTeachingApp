// Razorpay Payment Service Integration
// This handles all Razorpay payment operations for INR transactions

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        // Check if Razorpay is already loaded
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => {
            console.error('Failed to load Razorpay script');
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

// Initialize Razorpay payment
export const initiateRazorpayPayment = async (paymentDetails) => {
    const {
        courseId,
        courseName,
        amount, // in INR
        userEmail,
        userName,
        onSuccess,
        onError,
    } = paymentDetails;

    try {
        // Load Razorpay if not already loaded
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            throw new Error('Failed to load Razorpay script');
        }

        // Check if Razorpay is available
        if (typeof window.Razorpay === 'undefined') {
            throw new Error('Razorpay library is not available');
        }

        // Razorpay configuration
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag', // Use env variable
            amount: amount * 100, // Razorpay expects amount in paise (100 paise = 1 rupee)
            currency: 'INR',
            name: 'My Teaching App',
            description: `Enrollment for ${courseName}`,
            image: 'https://via.placeholder.com/150', // Your app logo
            prefill: {
                email: userEmail,
                name: userName,
            },
            notes: {
                courseId: courseId,
                courseName: courseName,
            },
            handler: function (response) {
                // Payment successful
                onSuccess({
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    signature: response.razorpay_signature,
                    courseId: courseId,
                });
            },
            modal: {
                ondismiss: function () {
                    // User closed payment modal
                    onError('Payment cancelled by user');
                },
            },
            retry: {
                enabled: true,
                max_count: 3,
            },
            timeout: 900, // 15 minutes
            theme: {
                color: '#0d6efd', // Bootstrap primary blue
            },
        };

        // Open Razorpay checkout
        const rzp = new window.Razorpay(options);
        
        // Handle errors
        rzp.on('payment.failed', function (response) {
            onError(response.error.description || 'Payment failed');
        });

        rzp.open();
    } catch (error) {
        console.error('Payment initiation error:', error);
        onError(error.message || 'Failed to initiate payment');
    }
};

// Verify payment on backend (optional but recommended for production)
export const verifyPayment = async (paymentData, api) => {
    try {
        const response = await api.post('/payments/verify', paymentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get course price
export const getCoursePrice = (course) => {
    return course.price || 99; // Default price in INR
};

// Format price for display
export const formatCoursePrice = (price) => {
    return `₹${Math.round(price).toLocaleString('en-IN')}`;
};