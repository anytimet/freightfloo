'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

interface PaymentFormProps {
  shipmentId: string
  bidId: string
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
}

function CheckoutForm({ shipmentId, bidId, amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shipmentId, bidId }),
      })

      const { clientSecret, paymentIntentId, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      // Confirm payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/shipment/${shipmentId}`,
        },
        redirect: 'if_required',
      })

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message || 'An error occurred')
        } else {
          setMessage('An unexpected error occurred')
        }
        onError(error.message || 'Payment failed')
      } else {
        setMessage('Payment successful! Processing...')
        
        // Payment completed successfully - webhook will handle the rest
        setMessage('Payment completed successfully! Shipment has been assigned.')
        onSuccess()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      setMessage(errorMessage)
      onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Total Amount</span>
          <span className="text-lg font-bold text-gray-900">${amount.toFixed(2)}</span>
        </div>
      </div>

      <PaymentElement />

      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('successful') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </button>
    </form>
  )
}

export default function PaymentForm({ shipmentId, bidId, amount, onSuccess, onError }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState('')
  const [isInitializing, setIsInitializing] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializing || clientSecret || hasInitialized) return

    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      setIsInitializing(true)
      setHasInitialized(true)
      try {
        const response = await fetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shipmentId, bidId }),
        })

        const data = await response.json()
        console.log('Payment intent response:', data)

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent')
        }

        if (data.error) {
          onError(data.error)
        } else if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          onError('No client secret received from server')
        }
      } catch (error) {
        console.error('Payment intent creation error:', error)
        onError(`Failed to initialize payment: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsInitializing(false)
      }
    }

    createPaymentIntent()
  }, [shipmentId, bidId, onError, isInitializing, clientSecret, hasInitialized])

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#2563eb',
      },
    },
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h4 className="text-lg font-semibold text-red-800 mb-2">Payment System Not Configured</h4>
        <p className="text-red-700">
          Stripe payment keys are not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment variables.
        </p>
      </div>
    )
  }

  if (isInitializing) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-700">Initializing payment form...</span>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading payment form...</span>
      </div>
    )
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm 
        shipmentId={shipmentId}
        bidId={bidId}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}
