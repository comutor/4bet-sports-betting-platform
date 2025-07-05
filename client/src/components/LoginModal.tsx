import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData?: any) => void;
  onSignupClick?: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess, onSignupClick }: LoginModalProps) {
  const [formData, setFormData] = useState({
    country: 'South Sudan',
    phoneNumber: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    phoneNumber: '',
    country: 'South Sudan'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const countries = [
    { name: 'South Sudan', code: '+211', flag: '🇸🇸' },
    { name: 'Uganda', code: '+256', flag: '🇺🇬' }
  ];

  const getPhonePrefix = () => {
    const country = countries.find(c => c.name === formData.country);
    return country?.code || '+211';
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phoneNumber') {
      // Only allow digits and limit to 9 characters
      const numericValue = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({ ...prev, [field]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePhoneNumber = (phoneNumber: string, country: string) => {
    if (!phoneNumber) return 'Phone number is required';
    if (phoneNumber.length !== 9) return 'Phone number must be exactly 9 digits';
    
    if (country === 'Uganda') {
      // MTN Uganda: 76, 77, 78, 79
      // Airtel Uganda: 70, 74, 75
      const validPrefixes = ['76', '77', '78', '79', '70', '74', '75'];
      const prefix = phoneNumber.substring(0, 2);
      
      if (!validPrefixes.includes(prefix)) {
        return 'Invalid number. Use MTN (76x, 77x, 78x, 79x) or Airtel (70x, 74x, 75x) numbers';
      }
    } else if (country === 'South Sudan') {
      // South Sudan: 92x prefix
      const prefix = phoneNumber.substring(0, 2);
      
      if (prefix !== '92') {
        return 'Invalid number. South Sudan numbers must start with 92x';
      }
    }
    
    return null;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const phoneError = validatePhoneNumber(formData.phoneNumber, formData.country);
    if (phoneError) newErrors.phoneNumber = phoneError;

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const fullPhoneNumber = getPhonePrefix() + formData.phoneNumber;
        const loginData = {
          phoneNumber: fullPhoneNumber,
          password: formData.password
        };

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(loginData),
        });

        const result = await response.json();
        
        if (response.ok) {
          onSuccess(result.user);
        } else {
          setErrors({ general: result.message || 'Login failed' });
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrors({ general: 'Network error. Please try again.' });
      }
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setErrors({});
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrors({});

    try {
      const fullPhoneNumber = getPhonePrefix() + forgotPasswordData.phoneNumber;
      
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setErrors({ 
          success: `Your password is: ${result.password}. ${result.note}` 
        });
      } else {
        setErrors({ general: result.message || 'Failed to retrieve password' });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleForgotPasswordInputChange = (field: string, value: string) => {
    if (field === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '').slice(0, 9);
      setForgotPasswordData(prev => ({ ...prev, [field]: numericValue }));
    } else {
      setForgotPasswordData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Login modal */}
      <div className="bg-slate-custom text-white w-full max-w-sm mx-4 rounded-lg relative z-10 transform transition-all duration-300 ease-in-out scale-100">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 rounded-t-lg border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {showForgotPassword ? 'Forgot Password' : 'Login'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={() => {
              setShowForgotPassword(false);
              setErrors({});
              onClose();
            }}
          >
            <i className="fas fa-times text-lg"></i>
          </Button>
        </div>

        {showForgotPassword ? (
          /* Forgot Password Form */
          <form onSubmit={handleForgotPasswordSubmit} className="p-6 space-y-4">
            {/* Country Selection */}
            <div className="space-y-2">
              <Label htmlFor="forgotCountry" className="text-white">Country</Label>
              <select
                id="forgotCountry"
                value={forgotPasswordData.country}
                onChange={(e) => handleForgotPasswordInputChange('country', e.target.value)}
                className="w-full bg-slate-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                {countries.map(country => (
                  <option key={country.name} value={country.name}>
                    {country.flag} {country.name} ({country.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <Label htmlFor="forgotPhoneNumber" className="text-white">Phone Number</Label>
              <div className="flex">
                <div className="bg-slate-700 border border-gray-600 border-r-0 px-3 py-2 rounded-l-md text-gray-300">
                  {countries.find(c => c.name === forgotPasswordData.country)?.code || '+211'}
                </div>
                <Input
                  id="forgotPhoneNumber"
                  type="tel"
                  value={forgotPasswordData.phoneNumber}
                  onChange={(e) => handleForgotPasswordInputChange('phoneNumber', e.target.value)}
                  className="bg-slate-700 border-gray-600 text-white rounded-l-none flex-1"
                  placeholder="Mobile number"
                />
              </div>
            </div>

            {/* Success/Error Messages */}
            {errors.success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-400 text-sm">{errors.success}</p>
              </div>
            )}

            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-transparent border-2 border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-105 font-bold py-2 mt-6"
            >
              {isProcessing ? 'RETRIEVING...' : 'GET PASSWORD'}
            </Button>

            {/* Back to Login */}
            <p className="text-center text-sm text-gray-400 mt-4">
              Remember your password?{' '}
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300"
                onClick={() => {
                  setShowForgotPassword(false);
                  setErrors({});
                }}
              >
                Back to login
              </button>
            </p>
          </form>
        ) : (
          /* Regular Login Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Country Selection */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-white">Phone</Label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full bg-slate-700 border border-gray-600 text-white rounded-md px-3 py-2"
            >
              {countries.map(country => (
                <option key={country.name} value={country.name}>
                  {country.flag} {country.name} ({country.code})
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Number */}
          <div className="space-y-2">
            <div className="flex">
              <div className="bg-slate-700 border border-gray-600 border-r-0 px-3 py-2 rounded-l-md text-gray-300">
                {getPhonePrefix()}
              </div>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="bg-slate-700 border-gray-600 text-white rounded-l-none flex-1"
                placeholder="Mobile number"
              />
            </div>
            {errors.phoneNumber && <p className="text-red-400 text-sm">{errors.phoneNumber}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="bg-slate-700 border-gray-600 text-white"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Forgot Password Button */}
          <div className="text-center">
            <button
              type="button"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
              onClick={() => {
                // Handle forgot password functionality
                handleForgotPassword();
              }}
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-transparent border-2 border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-105 font-bold py-2 mt-6"
          >
            LOG IN
          </Button>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-blue-400 hover:text-blue-300"
              onClick={() => {
                onClose();
                if (onSignupClick) {
                  onSignupClick();
                }
              }}
            >
              Sign up here
            </button>
          </p>
        </form>
        )}
      </div>
    </div>
  );
}