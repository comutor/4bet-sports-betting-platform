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
          <h2 className="text-xl font-bold text-white">Login</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <i className="fas fa-times text-lg"></i>
          </Button>
        </div>

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
      </div>
    </div>
  );
}