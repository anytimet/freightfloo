'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TruckIcon, EyeIcon, EyeSlashIcon, BuildingOfficeIcon, UserIcon, CheckIcon } from '@heroicons/react/24/outline'
import { EQUIPMENT_TYPES } from '@/lib/equipment-types'

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleFromUrl = searchParams.get('role') as 'SHIPPER' | 'CARRIER' | 'BOTH' | null

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: roleFromUrl || 'SHIPPER' as 'SHIPPER' | 'CARRIER' | 'BOTH',
    userType: 'INDIVIDUAL' as 'INDIVIDUAL' | 'COMPANY',
    companyName: '',
    companyWebsite: '',
    companyPhone: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyZipCode: '',
    companyCountry: 'US',
    dotNumber: '',
    mcNumber: '',
    carrierStatus: '',
    carrierVerified: false,
    equipmentTypes: [] as string[]
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [validatingCarrier, setValidatingCarrier] = useState(false)
  const [carrierValidationResult, setCarrierValidationResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/simple-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          equipmentTypes: formData.equipmentTypes.join(',')
        }),
      })

      if (response.ok) {
        const redirectUrl = searchParams.get('redirect') || '/auth/signin?message=Account created successfully'
        router.push(redirectUrl)
      } else {
        const data = await response.json()
        setError(data.message || 'An error occurred')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEquipmentTypeChange = (equipmentId: string) => {
    setFormData(prev => ({
      ...prev,
      equipmentTypes: prev.equipmentTypes.includes(equipmentId)
        ? prev.equipmentTypes.filter(id => id !== equipmentId)
        : [...prev.equipmentTypes, equipmentId]
    }))
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (formData.role === 'SHIPPER') {
        setCurrentStep(2)
      } else if (formData.role === 'CARRIER') {
        setCurrentStep(2)
      } else {
        handleSubmit(new Event('submit') as any)
      }
    } else if (currentStep === 2) {
      if (formData.role === 'SHIPPER') {
        if (formData.userType === 'COMPANY') {
          if (!formData.companyName || !formData.companyAddress || !formData.companyCity) {
            setError('Please fill in all required company fields')
            return
          }
          setCurrentStep(3)
        } else {
          handleSubmit(new Event('submit') as any)
        }
      } else if (formData.role === 'CARRIER') {
        if (!formData.dotNumber && !formData.mcNumber) {
          setError('Please enter either a DOT number or MC number')
          return
        }
        if (!formData.carrierVerified) {
          setError('Please validate your carrier information first')
          return
        }
        if (formData.equipmentTypes.length === 0) {
          setError('Please select at least one equipment type')
          return
        }
        handleSubmit(new Event('submit') as any)
      }
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setError('')
  }

  const validateCarrierInfo = async () => {
    if (!formData.dotNumber && !formData.mcNumber) {
      setError('Please enter either a DOT number or MC number')
      return
    }

    setValidatingCarrier(true)
    setError('')

    try {
      const response = await fetch('/api/validate-carrier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dotNumber: formData.dotNumber,
          mcNumber: formData.mcNumber,
        }),
      })

      const data = await response.json()

      if (data.valid) {
        setCarrierValidationResult(data.carrierData)
        setFormData({
          ...formData,
          carrierVerified: true,
          carrierStatus: data.carrierData.carrierOperation.carrierStatus,
          companyName: data.carrierData.legalName,
          companyAddress: data.carrierData.physicalAddress.address,
          companyCity: data.carrierData.physicalAddress.city,
          companyState: data.carrierData.physicalAddress.state,
          companyZipCode: data.carrierData.physicalAddress.zipCode,
        })
        setError('')
      } else {
        setError(data.message || 'Carrier validation failed')
        setCarrierValidationResult(null)
      }
    } catch (error) {
      setError('Failed to validate carrier information')
      setCarrierValidationResult(null)
    } finally {
      setValidatingCarrier(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full name *
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter your full name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address *
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter your email address"
          />
        </div>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Account type *
        </label>
        <div className="mt-1">
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input-field"
          >
            <option value="SHIPPER">Shipper - I need to ship freight</option>
            <option value="CARRIER">Carrier - I transport freight</option>
            <option value="BOTH">Both - I ship and transport freight</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password *
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="input-field pr-10"
            placeholder="Create a strong password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm password *
        </label>
        <div className="mt-1 relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-field pr-10"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => {
    if (formData.role === 'CARRIER') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Carrier Information</h3>
            <p className="text-sm text-gray-600">Please provide your DOT or MC number for verification</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dotNumber" className="block text-sm font-medium text-gray-700">
                DOT Number
              </label>
              <div className="mt-1">
                <input
                  id="dotNumber"
                  name="dotNumber"
                  type="text"
                  value={formData.dotNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter DOT number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="mcNumber" className="block text-sm font-medium text-gray-700">
                MC Number
              </label>
              <div className="mt-1">
                <input
                  id="mcNumber"
                  name="mcNumber"
                  type="text"
                  value={formData.mcNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter MC number"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={validateCarrierInfo}
              disabled={validatingCarrier || (!formData.dotNumber && !formData.mcNumber)}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {validatingCarrier ? 'Validating...' : 'Validate Carrier'}
            </button>
          </div>

          {carrierValidationResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <div className="h-5 w-5 text-green-600 mr-2">✓</div>
                <h4 className="font-semibold text-green-800">Carrier Verified</h4>
              </div>
              <div className="text-sm text-green-700">
                <p><strong>Company:</strong> {carrierValidationResult.legalName}</p>
                <p><strong>Status:</strong> {carrierValidationResult.carrierOperation.carrierStatus}</p>
                <p><strong>Operation:</strong> {carrierValidationResult.carrierOperation.carrierOperation}</p>
                {carrierValidationResult.drivers && (
                  <p><strong>Drivers:</strong> {carrierValidationResult.drivers}</p>
                )}
                {carrierValidationResult.powerUnits && (
                  <p><strong>Power Units:</strong> {carrierValidationResult.powerUnits}</p>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Select Your Equipment Types</h4>
              <p className="text-sm text-gray-600">Choose all equipment types you operate (you can select multiple)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EQUIPMENT_TYPES.map((equipment) => (
                <label
                  key={equipment.id}
                  className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.equipmentTypes.includes(equipment.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.equipmentTypes.includes(equipment.id)}
                    onChange={() => handleEquipmentTypeChange(equipment.id)}
                    className="sr-only"
                  />
                  <div className="flex items-start w-full">
                    <div className="text-2xl mr-3">{equipment.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{equipment.name}</div>
                      <div className="text-sm text-gray-600 mb-1">{equipment.description}</div>
                      <div className="text-xs text-gray-500">{equipment.capacity}</div>
                    </div>
                    {formData.equipmentTypes.includes(equipment.id) && (
                      <CheckIcon className="h-5 w-5 text-primary-600 ml-2" />
                    )}
                  </div>
                </label>
              ))}
            </div>

            {formData.equipmentTypes.length === 0 && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">Please select at least one equipment type</p>
              </div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Are you shipping as an individual or company?</h3>
          <p className="text-sm text-gray-600">This helps us provide you with the best experience</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            formData.userType === 'INDIVIDUAL' 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name="userType"
              value="INDIVIDUAL"
              checked={formData.userType === 'INDIVIDUAL'}
              onChange={handleChange}
              className="sr-only"
            />
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Individual</div>
                <div className="text-sm text-gray-600">Personal shipping needs</div>
              </div>
            </div>
          </label>

          <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            formData.userType === 'COMPANY' 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name="userType"
              value="COMPANY"
              checked={formData.userType === 'COMPANY'}
              onChange={handleChange}
              className="sr-only"
            />
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Company</div>
                <div className="text-sm text-gray-600">Business shipping needs</div>
              </div>
            </div>
          </label>
        </div>
      </div>
    )
  }

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Information</h3>
        <p className="text-sm text-gray-600">Please provide your company details</p>
      </div>

      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
          Company Name *
        </label>
        <div className="mt-1">
          <input
            id="companyName"
            name="companyName"
            type="text"
            required
            value={formData.companyName}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter your company name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="mt-1">
            <input
              id="companyPhone"
              name="companyPhone"
              type="tel"
              value={formData.companyPhone}
              onChange={handleChange}
              className="input-field"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700">
            Website
          </label>
          <div className="mt-1">
            <input
              id="companyWebsite"
              name="companyWebsite"
              type="url"
              value={formData.companyWebsite}
              onChange={handleChange}
              className="input-field"
              placeholder="https://www.company.com"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700">
          Street Address *
        </label>
        <div className="mt-1">
          <input
            id="companyAddress"
            name="companyAddress"
            type="text"
            required
            value={formData.companyAddress}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter street address"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="companyCity" className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <div className="mt-1">
            <input
              id="companyCity"
              name="companyCity"
              type="text"
              required
              value={formData.companyCity}
              onChange={handleChange}
              className="input-field"
              placeholder="City"
            />
          </div>
        </div>

        <div>
          <label htmlFor="companyState" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <div className="mt-1">
            <input
              id="companyState"
              name="companyState"
              type="text"
              value={formData.companyState}
              onChange={handleChange}
              className="input-field"
              placeholder="State"
            />
          </div>
        </div>

        <div>
          <label htmlFor="companyZipCode" className="block text-sm font-medium text-gray-700">
            ZIP Code
          </label>
          <div className="mt-1">
            <input
              id="companyZipCode"
              name="companyZipCode"
              type="text"
              value={formData.companyZipCode}
              onChange={handleChange}
              className="input-field"
              placeholder="12345"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="companyCountry" className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <div className="mt-1">
          <select
            id="companyCountry"
            name="companyCountry"
            value={formData.companyCountry}
            onChange={handleChange}
            className="input-field"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="MX">Mexico</option>
          </select>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <TruckIcon className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/auth/signin" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-8 h-0.5 ml-2 ${
                      step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-2 text-sm text-gray-600">
              Step {currentStep} of {formData.role === 'SHIPPER' ? 3 : formData.role === 'CARRIER' ? 2 : 1}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type={currentStep === (formData.role === 'SHIPPER' ? 3 : formData.role === 'CARRIER' ? 2 : 1) ? 'submit' : 'button'}
                onClick={currentStep === (formData.role === 'SHIPPER' ? 3 : formData.role === 'CARRIER' ? 2 : 1) ? undefined : nextStep}
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 
                 currentStep === (formData.role === 'SHIPPER' ? 3 : formData.role === 'CARRIER' ? 2 : 1) ? 'Create account' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
