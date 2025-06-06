import { useState } from 'react';
import { ChevronRight, User, Bell, Shield, Lock, UserX, HelpCircle, Info, Users } from 'lucide-react';

interface SettingsSectionProps {
  userCountry?: string;
  isLoggedIn: boolean;
  onClose?: () => void;
  onBackToAccount?: () => void;
}

export function SettingsSection({ userCountry, isLoggedIn, onClose, onBackToAccount }: SettingsSectionProps) {
  const [activeSection, setActiveSection] = useState<'main' | 'my-account' | 'general' | 'manage-account'>('main');

  const getCurrency = () => {
    return userCountry === 'Uganda' ? 'UGX' : 'SSP';
  };

  const renderMainSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-6">
        {onBackToAccount && (
          <button
            onClick={onBackToAccount}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
        )}
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>
      
      {isLoggedIn && (
        <div className="bg-white rounded-lg p-4 mb-4">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setActiveSection('my-account')}
          >
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">My Account</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setActiveSection('general')}
        >
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">General</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const renderMyAccountSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={() => setActiveSection('main')}
          className="text-white hover:text-gray-300"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-white">My Account</h1>
      </div>

      {/* Statements */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Statements</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Notifications</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Manage My Account */}
      <div className="bg-white rounded-lg p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setActiveSection('manage-account')}
        >
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Manage My Account</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const renderManageAccountSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={() => setActiveSection('my-account')}
          className="text-white hover:text-gray-300"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-white">Manage My Account</h1>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Change Password</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Self-Exclusion */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-3">
            <UserX className="w-5 h-5 text-red-600" />
            <span className="font-medium text-gray-900">Self-Exclusion</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={() => setActiveSection('main')}
          className="text-white hover:text-gray-300"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-white">General</h1>
      </div>

      {/* Why Join? */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Why Join?</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Help Center */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Help Center</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* More on NileBet */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">More on NileBet</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {activeSection === 'main' && renderMainSettings()}
      {activeSection === 'my-account' && renderMyAccountSettings()}
      {activeSection === 'manage-account' && renderManageAccountSettings()}
      {activeSection === 'general' && renderGeneralSettings()}
    </div>
  );
}