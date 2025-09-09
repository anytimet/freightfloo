// Google Analytics utility functions

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    })
  }
}

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// FreightFloo specific tracking events
export const trackShipmentCreated = (shipmentId: string, userRole: string) => {
  event({
    action: 'shipment_created',
    category: 'Shipment',
    label: `Role: ${userRole}`,
  })
}

export const trackBidPlaced = (shipmentId: string, bidAmount: number) => {
  event({
    action: 'bid_placed',
    category: 'Bidding',
    label: `Amount: $${bidAmount}`,
    value: bidAmount,
  })
}

export const trackBidAccepted = (shipmentId: string, bidAmount: number) => {
  event({
    action: 'bid_accepted',
    category: 'Bidding',
    label: `Amount: $${bidAmount}`,
    value: bidAmount,
  })
}

export const trackPaymentCompleted = (shipmentId: string, amount: number) => {
  event({
    action: 'payment_completed',
    category: 'Payment',
    label: `Amount: $${amount}`,
    value: amount,
  })
}

export const trackUserRegistration = (userRole: string) => {
  event({
    action: 'user_registration',
    category: 'User',
    label: `Role: ${userRole}`,
  })
}

export const trackUserLogin = (userRole: string) => {
  event({
    action: 'user_login',
    category: 'User',
    label: `Role: ${userRole}`,
  })
}

export const trackDocumentUploaded = (shipmentId: string, documentType: string) => {
  event({
    action: 'document_uploaded',
    category: 'Document',
    label: `Type: ${documentType}`,
  })
}

export const trackQuestionAsked = (shipmentId: string) => {
  event({
    action: 'question_asked',
    category: 'Communication',
  })
}

export const trackQuestionAnswered = (shipmentId: string) => {
  event({
    action: 'question_answered',
    category: 'Communication',
  })
}

export const trackReviewSubmitted = (shipmentId: string, rating: number) => {
  event({
    action: 'review_submitted',
    category: 'Review',
    label: `Rating: ${rating} stars`,
    value: rating,
  })
}

export const trackShipmentStatusUpdate = (shipmentId: string, status: string) => {
  event({
    action: 'shipment_status_update',
    category: 'Shipment',
    label: `Status: ${status}`,
  })
}

export const trackSearchPerformed = (searchTerm: string, resultsCount: number) => {
  event({
    action: 'search_performed',
    category: 'Search',
    label: searchTerm,
    value: resultsCount,
  })
}

export const trackFilterApplied = (filterType: string, filterValue: string) => {
  event({
    action: 'filter_applied',
    category: 'Search',
    label: `${filterType}: ${filterValue}`,
  })
}

export const trackPageView = (pageName: string) => {
  event({
    action: 'page_view',
    category: 'Navigation',
    label: pageName,
  })
}

export const trackError = (errorType: string, errorMessage: string) => {
  event({
    action: 'error_occurred',
    category: 'Error',
    label: `${errorType}: ${errorMessage}`,
  })
}

export const trackConversion = (conversionType: string, value?: number) => {
  event({
    action: 'conversion',
    category: 'Conversion',
    label: conversionType,
    value: value,
  })
}
