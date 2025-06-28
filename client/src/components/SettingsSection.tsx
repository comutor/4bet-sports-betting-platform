import { useState, useEffect } from 'react';
import { ChevronRight, User, Bell, Shield, Lock, UserX, HelpCircle, Info, Users, Receipt, Moon, Sun, Monitor } from 'lucide-react';

interface SettingsSectionProps {
  userCountry?: string;
  isLoggedIn: boolean;
  onClose?: () => void;
  onBackToAccount?: () => void;
}

export function SettingsSection({ userCountry, isLoggedIn, onClose, onBackToAccount }: SettingsSectionProps) {
  const [activeSection, setActiveSection] = useState<'main' | 'my-account'>('main');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | 'system' || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: 'dark' | 'light' | 'system') => {
    const root = document.documentElement;
    
    if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemPrefersDark);
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
  };

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

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

      {/* Theme Settings */}
      <div className="bg-slate-light-custom rounded-lg p-4 border border-slate-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Monitor className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-300">Theme</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Dark Mode */}
          <div 
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              theme === 'dark' ? 'bg-blue-600/20 border border-blue-500' : 'bg-slate-700 border border-slate-600 hover:bg-slate-600'
            }`}
            onClick={() => handleThemeChange('dark')}
          >
            <div className="flex items-center space-x-3">
              <Moon className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Dark Mode</span>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 ${
              theme === 'dark' ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
            }`}></div>
          </div>

          {/* Light Mode */}
          <div 
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              theme === 'light' ? 'bg-blue-600/20 border border-blue-500' : 'bg-slate-700 border border-slate-600 hover:bg-slate-600'
            }`}
            onClick={() => handleThemeChange('light')}
          >
            <div className="flex items-center space-x-3">
              <Sun className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Light Mode</span>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 ${
              theme === 'light' ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
            }`}></div>
          </div>

          {/* System Mode */}
          <div 
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              theme === 'system' ? 'bg-blue-600/20 border border-blue-500' : 'bg-slate-700 border border-slate-600 hover:bg-slate-600'
            }`}
            onClick={() => handleThemeChange('system')}
          >
            <div className="flex items-center space-x-3">
              <Monitor className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">System</span>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 ${
              theme === 'system' ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
            }`}></div>
          </div>
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





  return (
    <div className="p-4 max-w-4xl mx-auto">
      {activeSection === 'main' && renderMainSettings()}
      {activeSection === 'my-account' && renderMyAccountSettings()}
    </div>
  );
}