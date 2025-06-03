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
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    promoCode: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});



  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (!isLogin) {
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
      // Create username from first and last name
      const username = `${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}`;
      console.log('Registration data:', { ...formData, username });
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

        {/* First Name */}
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

        {/* Last Name */}
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