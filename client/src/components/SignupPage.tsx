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
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    country: '',
    currency: 'USD',
    promoCode: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway',
    'Brazil', 'Argentina', 'Mexico', 'Japan', 'South Korea'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'BRL', 'JPY'];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.country) newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
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
    <div className="min-h-screen bg-slate-custom text-white">
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

      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-md mx-auto">
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

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="bg-slate-700 border-gray-600 text-white"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-white">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="bg-slate-700 border-gray-600 text-white"
            placeholder="Choose a username"
          />
          {errors.username && <p className="text-red-400 text-sm">{errors.username}</p>}
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

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="bg-slate-700 border-gray-600 text-white"
                  placeholder="First name"
                />
                {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="bg-slate-700 border-gray-600 text-white"
                  placeholder="Last name"
                />
                {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
              </div>
            </div>

            {/* Phone and Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="bg-slate-700 border-gray-600 text-white"
                placeholder="Your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-white">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="bg-slate-700 border-gray-600 text-white"
              />
              {errors.dateOfBirth && <p className="text-red-400 text-sm">{errors.dateOfBirth}</p>}
            </div>

            {/* Country and Currency */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-white">Country</Label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full bg-slate-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="">Select your country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.country && <p className="text-red-400 text-sm">{errors.country}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-white">Currency</Label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full bg-slate-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
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
  );
}