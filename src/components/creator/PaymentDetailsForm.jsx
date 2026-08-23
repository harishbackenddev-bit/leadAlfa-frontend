// components/creator/PaymentDetailsForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, updatePaymentDetails, selectTradeSafeStatus } from '../../store/slices/authSlice';

export default function PaymentDetailsForm() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const tradesafeStatus = useSelector(selectTradeSafeStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    branchCode: '',
    accountType: 'checking',
  });

  useEffect(() => {
    // Pre-fill existing data if available
    if (user?.profile) {
      setFormData({
        bankName: user.profile.bankName || '',
        accountHolder: user.profile.accountHolder || '',
        accountNumber: user.profile.accountNumber || '',
        branchCode: user.profile.branchCode || '',
        accountType: user.profile.accountType || 'checking',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear message when user starts typing
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.bankName || !formData.accountHolder || !formData.accountNumber || !formData.branchCode) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await dispatch(updatePaymentDetails(formData)).unwrap();
      setMessage({ 
        type: 'success', 
        text: result.message || 'Payment details saved successfully! Your information is being verified.' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to save payment details. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Status message helper
  const getStatusMessage = () => {
    switch (tradesafeStatus) {
      case 'PENDING':
        return {
          type: 'info',
          text: '⏳ Your payment details are being verified. This usually takes 1-2 business days.'
        };
      case 'VERIFIED':
        return {
          type: 'success',
          text: '✅ Your payment details are verified. You\'re ready to receive payouts!'
        };
      case 'ACTION_REQUIRED':
        return {
          type: 'error',
          text: `❌ Your payment details need attention. ${user?.profile?.tradesafe_error_message || 'Please update your information.'}`
        };
      case 'FAILED':
        return {
          type: 'error',
          text: `❌ Payment verification failed. ${user?.profile?.tradesafe_error_message || 'Please re-enter your banking details.'}`
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h2>
        <p className="text-sm text-gray-600 mb-6">
          Add your banking details to receive payouts from campaigns.
        </p>

        {/* Status Message */}
        {statusInfo && (
          <div className={`mb-4 p-3 rounded-lg ${
            statusInfo.type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
            statusInfo.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {statusInfo.text}
          </div>
        )}

        {/* Form Message */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              disabled={tradesafeStatus === 'PENDING'}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g. First National Bank"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountHolder"
              value={formData.accountHolder}
              onChange={handleChange}
              disabled={tradesafeStatus === 'PENDING'}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Full name as on bank account"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              disabled={tradesafeStatus === 'PENDING'}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Bank account number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="branchCode"
              value={formData.branchCode}
              onChange={handleChange}
              disabled={tradesafeStatus === 'PENDING'}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Branch code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              disabled={tradesafeStatus === 'PENDING'}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="business">Business</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || tradesafeStatus === 'PENDING'}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                isLoading || tradesafeStatus === 'PENDING'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading 
                ? 'Saving...' 
                : tradesafeStatus === 'PENDING' 
                ? 'Verification In Progress' 
                : 'Save Payment Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}