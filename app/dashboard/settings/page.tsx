'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  TruckIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

interface UserSettings {
  name: string
  email: string
  phone?: string
  companyName?: string
  companyPhone?: string
  companyWebsite?: string
  companyLogo?: string
  companyAddress?: string
  companyCity?: string
  companyState?: string
  companyZipCode?: string
  companyCountry?: string
  equipmentTypes: string[]
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  privacy: {
    profileVisible: boolean
    contactVisible: boolean
  }
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    companyPhone: '',
    companyWebsite: '',
    companyLogo: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyZipCode: '',
    companyCountry: '',
    equipmentTypes: [],
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    privacy: {
      profileVisible: true,
      contactVisible: false
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (session?.user) {
      fetchUserSettings()
    }
  }, [session])

  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/user/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings || settings)
      }
    } catch (error) {
      console.error('Error fetching user settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })
      
      if (response.ok) {
        // Show success message
        console.log('Settings saved successfully')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedInputChange = (parent: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] && typeof prev[parent] === 'object' ? prev[parent] as Record<string, any> : {}),
        [field]: value
      }
    }))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('logo', file)

      // Upload to server
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({
          ...prev,
          companyLogo: data.fileUrl
        }))
      } else {
        alert('Failed to upload logo')
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      alert('Error uploading logo')
    }
  }

  const equipmentTypes = [
    'Dry Van',
    'Refrigerated',
    'Flatbed',
    'Container',
    'Tanker',
    'Car Carrier',
    'Heavy Haul',
    'Intermodal'
  ]

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'company', name: 'Company', icon: BuildingOfficeIcon },
    { id: 'address', name: 'Address', icon: MapPinIcon },
    { id: 'equipment', name: 'Equipment', icon: TruckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
    { id: 'security', name: 'Security', icon: KeyIcon }
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={settings.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={settings.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={settings.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Tab */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Company Information</h2>
                    
                    <div className="space-y-6">
                      {/* Company Logo Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Logo
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                            {settings.companyLogo ? (
                              <img
                                src={settings.companyLogo}
                                alt="Company Logo"
                                className="w-full h-full object-contain rounded-lg"
                              />
                            ) : (
                              <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleLogoUpload(e)}
                              className="hidden"
                              id="logo-upload"
                            />
                            <label
                              htmlFor="logo-upload"
                              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              {settings.companyLogo ? 'Change Logo' : 'Upload Logo'}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, or SVG. Max size 2MB.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={settings.companyName || ''}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            placeholder="Your Company Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Phone
                          </label>
                          <input
                            type="tel"
                            value={settings.companyPhone || ''}
                            onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Website
                        </label>
                        <input
                          type="url"
                          value={settings.companyWebsite || ''}
                          onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                          placeholder="https://www.yourcompany.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Address Tab */}
              {activeTab === 'address' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Address Information</h2>
                    <p className="text-sm text-gray-600 mb-6">Update your company address information</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={settings.companyAddress || ''}
                          onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                          placeholder="123 Main Street"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={settings.companyCity || ''}
                            onChange={(e) => handleInputChange('companyCity', e.target.value)}
                            placeholder="New York"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State/Province
                          </label>
                          <input
                            type="text"
                            value={settings.companyState || ''}
                            onChange={(e) => handleInputChange('companyState', e.target.value)}
                            placeholder="NY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP/Postal Code
                          </label>
                          <input
                            type="text"
                            value={settings.companyZipCode || ''}
                            onChange={(e) => handleInputChange('companyZipCode', e.target.value)}
                            placeholder="10001"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <select
                            value={settings.companyCountry || ''}
                            onChange={(e) => handleInputChange('companyCountry', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="MX">Mexico</option>
                            <option value="GB">United Kingdom</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="IT">Italy</option>
                            <option value="ES">Spain</option>
                            <option value="AU">Australia</option>
                            <option value="JP">Japan</option>
                            <option value="CN">China</option>
                            <option value="IN">India</option>
                            <option value="BR">Brazil</option>
                            <option value="AR">Argentina</option>
                            <option value="CL">Chile</option>
                            <option value="CO">Colombia</option>
                            <option value="PE">Peru</option>
                            <option value="VE">Venezuela</option>
                            <option value="EC">Ecuador</option>
                            <option value="UY">Uruguay</option>
                            <option value="PY">Paraguay</option>
                            <option value="BO">Bolivia</option>
                            <option value="GY">Guyana</option>
                            <option value="SR">Suriname</option>
                            <option value="GF">French Guiana</option>
                            <option value="FK">Falkland Islands</option>
                            <option value="GS">South Georgia and the South Sandwich Islands</option>
                            <option value="BZ">Belize</option>
                            <option value="GT">Guatemala</option>
                            <option value="SV">El Salvador</option>
                            <option value="HN">Honduras</option>
                            <option value="NI">Nicaragua</option>
                            <option value="CR">Costa Rica</option>
                            <option value="PA">Panama</option>
                            <option value="CU">Cuba</option>
                            <option value="JM">Jamaica</option>
                            <option value="HT">Haiti</option>
                            <option value="DO">Dominican Republic</option>
                            <option value="PR">Puerto Rico</option>
                            <option value="VI">U.S. Virgin Islands</option>
                            <option value="BS">Bahamas</option>
                            <option value="BB">Barbados</option>
                            <option value="TT">Trinidad and Tobago</option>
                            <option value="AG">Antigua and Barbuda</option>
                            <option value="DM">Dominica</option>
                            <option value="GD">Grenada</option>
                            <option value="KN">Saint Kitts and Nevis</option>
                            <option value="LC">Saint Lucia</option>
                            <option value="VC">Saint Vincent and the Grenadines</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Equipment Tab */}
              {activeTab === 'equipment' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Equipment Types</h2>
                    <p className="text-sm text-gray-600 mb-4">Select the types of equipment you operate</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {equipmentTypes.map((equipment) => (
                        <label key={equipment} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.equipmentTypes.includes(equipment)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange('equipmentTypes', [...settings.equipmentTypes, equipment])
                              } else {
                                handleInputChange('equipmentTypes', settings.equipmentTypes.filter(t => t !== equipment))
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{equipment}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive notifications via email</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.email}
                          onChange={(e) => handleNestedInputChange('notifications', 'email', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                            <p className="text-sm text-gray-600">Receive notifications via text message</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.sms}
                          onChange={(e) => handleNestedInputChange('notifications', 'sms', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <BellIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.push}
                          onChange={(e) => handleNestedInputChange('notifications', 'push', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Profile Visibility</p>
                          <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.privacy.profileVisible}
                          onChange={(e) => handleNestedInputChange('privacy', 'profileVisible', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Contact Information</p>
                          <p className="text-sm text-gray-600">Allow others to see your contact information</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.privacy.contactVisible}
                          onChange={(e) => handleNestedInputChange('privacy', 'contactVisible', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Security</h2>
                    
                    <div className="space-y-4">
                      <button className="btn-secondary">
                        Change Password
                      </button>
                      
                      <button className="btn-secondary">
                        Enable Two-Factor Authentication
                      </button>
                      
                      <button className="btn-secondary text-red-600 hover:bg-red-50">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
