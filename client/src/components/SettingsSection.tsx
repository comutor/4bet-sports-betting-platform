import { useState } from 'react';
import { ChevronRight, User, Bell, Shield, Lock, UserX, HelpCircle, Info, Users, Receipt } from 'lucide-react';

interface SettingsSectionProps {
  userCountry?: string;
  isLoggedIn: boolean;
  onClose?: () => void;
  onBackToAccount?: () => void;
}

export function SettingsSection({ userCountry, isLoggedIn, onClose, onBackToAccount }: SettingsSectionProps) {
  const [activeSection, setActiveSection] = useState<'main' | 'my-account' | 'general'>('main');

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
        <div className="bg-slate-light-custom rounded-lg p-4 mb-4 border border-slate-600">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setActiveSection('my-account')}
          >
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-300">My Account</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      )}

      <div className="bg-slate-light-custom rounded-lg p-4 border border-slate-600">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setActiveSection('general')}
        >
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-300">General</span>
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
      <div className="bg-slate-light-custom rounded-lg p-4 border border-slate-600">
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-300">Why Join?</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Help Center */}
      <div className="bg-slate-light-custom rounded-lg p-4 border border-slate-600">
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-300">Help Center</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* More on TATAbets */}
      <div className="bg-slate-light-custom rounded-lg p-4 border border-slate-600">
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-300">More on TATAbets</span>
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
      {activeSection === 'general' && renderGeneralSettings()}
    </div>
  );
}