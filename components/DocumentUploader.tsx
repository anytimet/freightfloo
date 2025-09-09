'use client'

import { useState, useRef } from 'react'
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  XMarkIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Document {
  id: string
  title: string
  description: string | null
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  category: string
  isPublic: boolean
  isRequired: boolean
  uploadedAt: string
  uploadedBy: {
    id: string
    name: string
  }
}

interface DocumentUploaderProps {
  shipmentId?: string
  tripId?: string
  onDocumentUploaded: (document: Document) => void
  onDocumentDeleted: (documentId: string) => void
  existingDocuments?: Document[]
  userRole: 'SHIPPER' | 'CARRIER'
}

const documentCategories = [
  { value: 'BILL_OF_LADING', label: 'Bill of Lading' },
  { value: 'INSURANCE', label: 'Insurance Certificate' },
  { value: 'PERMIT', label: 'Permit' },
  { value: 'INVOICE', label: 'Invoice' },
  { value: 'RECEIPT', label: 'Receipt' },
  { value: 'INSPECTION', label: 'Inspection Report' },
  { value: 'WEIGHT_TICKET', label: 'Weight Ticket' },
  { value: 'OTHER', label: 'Other' }
]

const requiredDocuments = {
  SHIPPER: ['BILL_OF_LADING'],
  CARRIER: ['INSURANCE', 'PERMIT'],
  ADMIN: []
}

export default function DocumentUploader({
  shipmentId,
  tripId,
  onDocumentUploaded,
  onDocumentDeleted,
  existingDocuments = [],
  userRole
}: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    isPublic: false,
    isRequired: false
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if (!allowedTypes.includes(file.type)) {
      setUploadError('File type not supported. Please upload PDF, images, or Office documents.')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size too large. Please upload files smaller than 10MB.')
      return
    }

    // Auto-fill form with file info
    setUploadForm(prev => ({
      ...prev,
      title: file.name.split('.')[0],
      category: prev.category || 'OTHER'
    }))

    setShowUploadForm(true)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError('')

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      formData.append('category', uploadForm.category)
      formData.append('isPublic', uploadForm.isPublic.toString())
      formData.append('isRequired', uploadForm.isRequired.toString())
      
      if (shipmentId) formData.append('shipmentId', shipmentId)
      if (tripId) formData.append('tripId', tripId)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload document')
      }

      onDocumentUploaded(data.document)
      setShowUploadForm(false)
      setUploadForm({
        title: '',
        description: '',
        category: '',
        isPublic: false,
        isRequired: false
      })
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      onDocumentDeleted(documentId)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Delete failed')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return '🖼️'
    } else if (fileType === 'application/pdf') {
      return '📄'
    } else if (fileType.includes('word')) {
      return '📝'
    } else if (fileType.includes('excel') || fileType.includes('sheet')) {
      return '📊'
    }
    return '📎'
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'BILL_OF_LADING': 'bg-blue-100 text-blue-800',
      'INSURANCE': 'bg-green-100 text-green-800',
      'PERMIT': 'bg-yellow-100 text-yellow-800',
      'INVOICE': 'bg-purple-100 text-purple-800',
      'RECEIPT': 'bg-orange-100 text-orange-800',
      'INSPECTION': 'bg-red-100 text-red-800',
      'WEIGHT_TICKET': 'bg-indigo-100 text-indigo-800',
      'OTHER': 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors['OTHER']
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Upload Documents & Images
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop files here, or click to select files
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Select Files'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx"
          onChange={handleFileInputChange}
        />
        <p className="text-xs text-gray-400 mt-2">
          Supported: PDF, Images, Word, Excel (Max 10MB)
        </p>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upload Document</h2>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {uploadError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {uploadError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {documentCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={uploadForm.isPublic}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Make visible to other party</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={uploadForm.isRequired}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, isRequired: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Required document</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // This would be called with the actual file
                    // handleUpload(file)
                  }}
                  disabled={!uploadForm.title || !uploadForm.category}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      {existingDocuments.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Uploaded Documents</h3>
          {existingDocuments.map((doc) => (
            <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getFileIcon(doc.fileType)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{doc.title}</h4>
                      {doc.isRequired && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Required
                        </span>
                      )}
                      {doc.isPublic && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Public
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{doc.fileName}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>{formatDate(doc.uploadedAt)}</span>
                      <span>by {doc.uploadedBy.name}</span>
                    </div>
                    {doc.description && (
                      <p className="text-sm text-gray-600 mt-2">{doc.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(doc.category)}`}>
                    {documentCategories.find(c => c.value === doc.category)?.label || doc.category}
                  </span>
                  
                  <div className="flex space-x-1">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="View Document"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete Document"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Required Documents Checklist */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Required Documents</h3>
        <div className="space-y-1">
          {(requiredDocuments[userRole] || []).map((category) => {
            const hasDocument = existingDocuments.some(doc => 
              doc.category === category && doc.isRequired
            )
            return (
              <div key={category} className="flex items-center space-x-2">
                {hasDocument ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                )}
                <span className={`text-sm ${hasDocument ? 'text-green-800' : 'text-yellow-800'}`}>
                  {documentCategories.find(c => c.value === category)?.label || category}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
