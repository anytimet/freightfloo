'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  ChatBubbleLeftIcon, 
  PlusIcon, 
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import MobileButton from './MobileButton'
import MobileInput from './MobileInput'
import MobileTextarea from './MobileTextarea'
import MobileModal from './MobileModal'

interface Question {
  id: string
  title: string
  content: string
  isPublic: boolean
  isAnswered: boolean
  createdAt: string
  asker: {
    id: string
    name: string
    role: string
  }
  answerer?: {
    id: string
    name: string
    role: string
  }
  answers: Answer[]
}

interface Answer {
  id: string
  content: string
  isPublic: boolean
  createdAt: string
  answerer: {
    id: string
    name: string
    role: string
  }
}

interface QuestionAnswerSystemProps {
  shipmentId: string
  otherPartyId: string
  otherPartyName: string
  otherPartyRole: 'SHIPPER' | 'CARRIER'
  userRole: 'SHIPPER' | 'CARRIER'
}

export default function QuestionAnswerSystem({
  shipmentId,
  otherPartyId,
  otherPartyName,
  otherPartyRole,
  userRole
}: QuestionAnswerSystemProps) {
  const { data: session } = useSession()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showAskQuestion, setShowAskQuestion] = useState(false)
  const [showAnswerModal, setShowAnswerModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())

  const [askForm, setAskForm] = useState({
    title: '',
    content: '',
    isPublic: false
  })

  const [answerForm, setAnswerForm] = useState({
    content: '',
    isPublic: false
  })

  useEffect(() => {
    fetchQuestions()
  }, [shipmentId])

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/questions?shipmentId=${shipmentId}`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions || [])
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!askForm.title.trim() || !askForm.content.trim()) return

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipmentId,
          title: askForm.title,
          content: askForm.content,
          isPublic: askForm.isPublic,
          answererId: otherPartyId
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setQuestions(prev => [data.question, ...prev])
        setAskForm({ title: '', content: '', isPublic: false })
        setShowAskQuestion(false)
      }
    } catch (error) {
      console.error('Error asking question:', error)
    }
  }

  const handleAnswerQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answerForm.content.trim() || !selectedQuestion) return

    try {
      const response = await fetch('/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: selectedQuestion.id,
          content: answerForm.content,
          isPublic: answerForm.isPublic
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setQuestions(prev => 
          prev.map(q => 
            q.id === selectedQuestion.id 
              ? { ...q, answers: [...q.answers, data.answer], isAnswered: true }
              : q
          )
        )
        setAnswerForm({ content: '', isPublic: false })
        setShowAnswerModal(false)
        setSelectedQuestion(null)
      }
    } catch (error) {
      console.error('Error answering question:', error)
    }
  }

  const toggleQuestionExpansion = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
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

  const canAnswerQuestion = (question: Question) => {
    return question.asker.id !== (session?.user as any)?.id && 
           question.answererId === (session?.user as any)?.id
  }

  const canViewQuestion = (question: Question) => {
    const userId = (session?.user as any)?.id
    return question.isPublic || 
           question.asker.id === userId || 
           question.answererId === userId
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Questions & Answers</h3>
          <p className="text-sm text-gray-600">
            Ask questions to {otherPartyName} ({otherPartyRole.toLowerCase()})
          </p>
        </div>
        <MobileButton
          onClick={() => setShowAskQuestion(true)}
          size="sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Ask Question
        </MobileButton>
      </div>

      {/* Questions List */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions
            .filter(canViewQuestion)
            .map((question) => (
            <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-4">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{question.title}</h4>
                    {question.isAnswered && (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    )}
                    {!question.isAnswered && (
                      <ClockIcon className="h-4 w-4 text-yellow-500" />
                    )}
                    {question.isPublic ? (
                      <EyeIcon className="h-4 w-4 text-blue-500" />
                    ) : (
                      <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <UserIcon className="h-4 w-4" />
                    <span>Asked by {question.asker.name} ({question.asker.role.toLowerCase()})</span>
                    <span>•</span>
                    <span>{formatDate(question.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleQuestionExpansion(question.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {expandedQuestions.has(question.id) ? 'Hide' : 'View'}
                </button>
              </div>

              {/* Question Content */}
              {expandedQuestions.has(question.id) && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700">{question.content}</p>
                  </div>

                  {/* Answers */}
                  {question.answers.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">Answers:</h5>
                      {question.answers
                        .filter(answer => answer.isPublic || answer.answerer.id === (session?.user as any)?.id)
                        .map((answer) => (
                        <div key={answer.id} className="bg-blue-50 rounded-lg p-3 ml-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <UserIcon className="h-4 w-4" />
                            <span>Answered by {answer.answerer.name} ({answer.answerer.role.toLowerCase()})</span>
                            <span>•</span>
                            <span>{formatDate(answer.createdAt)}</span>
                          </div>
                          <p className="text-gray-700">{answer.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Answer Button */}
                  {canAnswerQuestion(question) && (
                    <div className="flex justify-end">
                      <MobileButton
                        onClick={() => {
                          setSelectedQuestion(question)
                          setShowAnswerModal(true)
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Answer Question
                      </MobileButton>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
          <p className="text-gray-500 mb-4">
            Be the first to ask a question about this shipment
          </p>
          <MobileButton onClick={() => setShowAskQuestion(true)}>
            Ask First Question
          </MobileButton>
        </div>
      )}

      {/* Ask Question Modal */}
      <MobileModal
        isOpen={showAskQuestion}
        onClose={() => setShowAskQuestion(false)}
        title="Ask a Question"
        size="md"
      >
        <form onSubmit={handleAskQuestion} className="space-y-4">
          <MobileInput
            label="Question Title"
            value={askForm.title}
            onChange={(e) => setAskForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="What would you like to know?"
            required
          />
          
          <MobileTextarea
            label="Question Details"
            value={askForm.content}
            onChange={(e) => setAskForm(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Provide more details about your question..."
            rows={4}
            required
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={askForm.isPublic}
              onChange={(e) => setAskForm(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              Make this question public (visible to other users)
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <MobileButton
              type="button"
              variant="outline"
              onClick={() => setShowAskQuestion(false)}
            >
              Cancel
            </MobileButton>
            <MobileButton type="submit">
              Ask Question
            </MobileButton>
          </div>
        </form>
      </MobileModal>

      {/* Answer Question Modal */}
      <MobileModal
        isOpen={showAnswerModal}
        onClose={() => setShowAnswerModal(false)}
        title="Answer Question"
        size="md"
      >
        {selectedQuestion && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 mb-2">{selectedQuestion.title}</h4>
              <p className="text-gray-700">{selectedQuestion.content}</p>
            </div>

            <form onSubmit={handleAnswerQuestion} className="space-y-4">
              <MobileTextarea
                label="Your Answer"
                value={answerForm.content}
                onChange={(e) => setAnswerForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Provide your answer..."
                rows={4}
                required
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="answerIsPublic"
                  checked={answerForm.isPublic}
                  onChange={(e) => setAnswerForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="answerIsPublic" className="text-sm text-gray-700">
                  Make this answer public (visible to other users)
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <MobileButton
                  type="button"
                  variant="outline"
                  onClick={() => setShowAnswerModal(false)}
                >
                  Cancel
                </MobileButton>
                <MobileButton type="submit">
                  Submit Answer
                </MobileButton>
              </div>
            </form>
          </div>
        )}
      </MobileModal>
    </div>
  )
}
