import { useState } from 'react';
import toast from 'react-hot-toast';
import { initiateRazorpayPayment, formatCoursePrice } from '../api/razorpay';

const PaymentModal = ({ course, user, isOpen, onClose, onPaymentSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        if (!user?.email || !user?.username) {
            toast.error('Please login to make payment');
            return;
        }

        if (!course?.price || course.price <= 0) {
            toast.error('Invalid course price');
            return;
        }

        setIsProcessing(true);

        try {
            await initiateRazorpayPayment({
                courseId: course.id,
                courseName: course.title,
                amount: course.price,
                userEmail: user.email,
                userName: user.username,
                onSuccess: (paymentData) => {
                    toast.success('Payment successful! Enrolling you now...');
                    onPaymentSuccess(paymentData);
                    onClose();
                },
                onError: (error) => {
                    toast.error(`Payment failed: ${error}`);
                    setIsProcessing(false);
                },
            });
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Failed to initiate payment');
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
            onClick={onClose}
        >
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    {/* Header */}
                    <div className="modal-header bg-primary text-white border-0 p-4">
                        <h5 className="modal-title fw-bold">
                            <i className="bi bi-lock-fill me-2"></i>
                            Secure Payment with Razorpay
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                            disabled={isProcessing}
                        ></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body p-4">
                        {/* Course Info */}
                        <div className="mb-4 p-3 bg-light rounded-3">
                            <h6 className="fw-bold text-dark mb-2">{course.title}</h6>
                            <p className="text-muted small mb-0">by {course.instructorName}</p>
                        </div>

                        {/* Price Details */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted">Course Price:</span>
                                <span className="fw-bold">{formatCoursePrice(course.price)}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Total Amount:</span>
                                <span className="fw-bold text-primary fs-5">{formatCoursePrice(course.price)}</span>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="mb-4 p-3 bg-light rounded-3">
                            <h6 className="fw-bold mb-3">After Payment, you get:</h6>
                            <ul className="list-unstyled small">
                                <li className="mb-2">
                                    <i className="bi bi-check-circle text-success me-2"></i>
                                    <strong>Lifetime Access</strong> to all course materials
                                </li>
                                <li className="mb-2">
                                    <i className="bi bi-check-circle text-success me-2"></i>
                                    <strong>Certificate of Completion</strong> upon finishing
                                </li>
                                <li className="mb-2">
                                    <i className="bi bi-check-circle text-success me-2"></i>
                                    <strong>Mobile & Desktop Access</strong> anywhere, anytime
                                </li>
                                <li>
                                    <i className="bi bi-check-circle text-success me-2"></i>
                                    <strong>30-Day Money-Back Guarantee</strong> if unsatisfied
                                </li>
                            </ul>
                        </div>

                        {/* User Info */}
                        <div className="mb-4 p-3 bg-light rounded-3">
                            <h6 className="fw-bold mb-2">Payment Details:</h6>
                            <p className="small text-muted mb-1">
                                <strong>Name:</strong> {user?.username}
                            </p>
                            <p className="small text-muted mb-0">
                                <strong>Email:</strong> {user?.email}
                            </p>
                        </div>

                        {/* Secure Badge */}
                        <div className="text-center mb-3">
                            <small className="text-muted">
                                <i className="bi bi-shield-check text-success me-1"></i>
                                100% Secure Payment Powered by Razorpay
                            </small>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer border-0 p-4 bg-light d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary rounded-pill px-4 fw-semibold"
                            onClick={onClose}
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-success rounded-pill px-4 fw-semibold"
                            onClick={handlePayment}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-credit-card me-2"></i>
                                    Pay {formatCoursePrice(course.price)}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;