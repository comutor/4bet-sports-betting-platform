import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignupPageProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export function SignupPage({ onClose, onSuccess }: SignupPageProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    country: 'South Sudan', // Default to South Sudan
    phoneNumber: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    promoCode: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const countries = [
    { name: 'South Sudan', code: '+211', flag: '🇸🇸' },
    { name: 'Uganda', code: '+256', flag: '🇺🇬' }
  ];

  const getPhonePrefix = () => {
    const country = countries.find(c => c.name === formData.country);
    return country ? country.code : '+211';
  };



  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (!isLogin) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (isLogin) {
        // Login with phone number and password
        const fullPhoneNumber = `${getPhonePrefix()}${formData.phoneNumber}`;
        console.log('Login data:', { 
          phoneNumber: fullPhoneNumber,
          password: formData.password 
        });
      } else {
        // Registration with full user data
        const username = `${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}`;
        const fullPhoneNumber = `${getPhonePrefix()}${formData.phoneNumber}`;
        console.log('Registration data:', { 
          ...formData, 
          username,
          phoneNumber: fullPhoneNumber
        });
      }
      // Simulate successful registration/login
      onSuccess?.();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Sliding panel */}
      <div className="ml-auto bg-slate-custom text-white w-full max-w-md h-full overflow-y-auto relative z-10 transform transition-transform duration-300 ease-in-out translate-x-0">
        {/* Header */}
        <div className="bg-slate-800 p-6 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            {isLogin ? 'Log In' : 'Sign Up'}
          </h1>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <i className="fas fa-times text-2xl"></i>
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Toggle Login/Signup */}
        <div className="flex rounded-lg bg-slate-800 p-1">
          <Button
            type="button"
            variant={!isLogin ? "default" : "ghost"}
            className={`flex-1 ${!isLogin ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </Button>
          <Button
            type="button"
            variant={isLogin ? "default" : "ghost"}
            className={`flex-1 ${isLogin ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            onClick={() => setIsLogin(true)}
          >
            Log In
          </Button>
        </div>

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
          {errors.country && <p className="text-red-400 text-sm">{errors.country}</p>}
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-white">Mobile</Label>
          <div className="flex">
            <div className="bg-slate-700 border border-gray-600 border-r-0 rounded-l-md px-3 py-2 text-white font-medium">
              {getPhonePrefix()}
            </div>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="bg-slate-700 border-gray-600 text-white rounded-l-none border-l-0"
              placeholder="Enter your mobile number"
            />
          </div>
          {errors.phoneNumber && <p className="text-red-400 text-sm">{errors.phoneNumber}</p>}
        </div>

        {/* First Name - Only show during signup */}
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-white">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="bg-slate-700 border-gray-600 text-white"
              placeholder="Enter your first name"
            />
            {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
          </div>
        )}

        {/* Last Name - Only show during signup */}
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-white">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="bg-slate-700 border-gray-600 text-white"
              placeholder="Enter your last name"
            />
            {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
          </div>
        )}

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

        {/* Signup-only fields */}
        {!isLogin && (
          <>
            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="bg-slate-700 border-gray-600 text-white"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
            </div>







            {/* Promo Code */}
            <div className="space-y-2">
              <Label htmlFor="promoCode" className="text-white">Promo Code (Optional)</Label>
              <Input
                id="promoCode"
                value={formData.promoCode}
                onChange={(e) => handleInputChange('promoCode', e.target.value)}
                className="bg-slate-700 border-gray-600 text-white"
                placeholder="Enter promo code"
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
        >
          {isLogin ? 'LOG IN' : 'CREATE ACCOUNT'}
        </Button>

        {/* Terms and conditions for signup */}
        {!isLogin && (
          <p className="text-xs text-gray-400 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
            You must be 18+ to register.
          </p>
        )}
      </form>
      </div>
    </div>
  );
}