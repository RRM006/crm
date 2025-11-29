import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Send, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Loader2, 
  Sparkles,
  ChevronRight,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  Wrench,
  Database,
  Zap
} from 'lucide-react'
import { aiAPI } from '../../services/api'
import { useCompany } from '../../context/CompanyContext'
import toast from 'react-hot-toast'

const AIChatbot = ({ isOpen, onClose }) => {
  const { currentRole } = useCompany()
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      fetchConversations()
      fetchSuggestions()
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    try {
      const response = await aiAPI.getConversations()
      if (response.data.success) {
        setConversations(response.data.data.conversations)
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const response = await aiAPI.getSuggestions()
      if (response.data.success) {
        setSuggestions(response.data.data.suggestions)
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
    }
  }

  const loadConversation = async (id) => {
    try {
      const response = await aiAPI.getConversation(id)
      if (response.data.success) {
        const conv = response.data.data.conversation
        setCurrentConversation(conv)
        setMessages(conv.messages || [])
        setShowHistory(false)
      }
    } catch (error) {
      toast.error('Failed to load conversation')
    }
  }

  const startNewConversation = () => {
    setCurrentConversation(null)
    setMessages([])
    setShowHistory(false)
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message immediately
    const tempUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])
    
    setIsLoading(true)
    try {
      const response = await aiAPI.chat(userMessage, currentConversation?.id)
      
      if (response.data.success) {
        const { conversationId, message, title } = response.data.data
        
        // Update current conversation
        if (!currentConversation) {
          setCurrentConversation({ id: conversationId, title })
        }
        
        // Add AI response
        setMessages(prev => [...prev, message])
        
        // Refresh conversations list
        fetchConversations()
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get AI response'
      toast.error(errorMessage)
      // Remove the user message if failed
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConversation = async (id, e) => {
    e.stopPropagation()
    try {
      await aiAPI.deleteConversation(id)
      setConversations(prev => prev.filter(c => c.id !== id))
      if (currentConversation?.id === id) {
        startNewConversation()
      }
      toast.success('Conversation deleted')
    } catch (error) {
      toast.error('Failed to delete conversation')
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete all conversations?')) return
    try {
      await aiAPI.clearConversations()
      setConversations([])
      startNewConversation()
      toast.success('All conversations cleared')
    } catch (error) {
      toast.error('Failed to clear conversations')
    }
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-0 h-full w-full max-w-lg bg-white dark:bg-dark-900 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-200 dark:border-dark-700 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">AI Assistant</h2>
                <p className="text-xs text-dark-500">
                  {currentRole} Access • Gemini Powered
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-lg transition-colors ${
                  showHistory 
                    ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' 
                    : 'hover:bg-dark-100 dark:hover:bg-dark-800'
                }`}
                title="Chat History"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <button
                onClick={startNewConversation}
                className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                title="New Chat"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* History Panel */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '260px', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-r border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-800/50 overflow-hidden"
                >
                  <div className="p-3 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">History</h3>
                      {conversations.length > 0 && (
                        <button
                          onClick={handleClearAll}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="flex-1 overflow-auto space-y-1">
                      {conversations.length === 0 ? (
                        <p className="text-sm text-dark-500 text-center py-4">
                          No conversations yet
                        </p>
                      ) : (
                        conversations.map((conv) => (
                          <button
                            key={conv.id}
                            onClick={() => loadConversation(conv.id)}
                            className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors group ${
                              currentConversation?.id === conv.id
                                ? 'bg-violet-100 dark:bg-violet-900/30'
                                : 'hover:bg-dark-100 dark:hover:bg-dark-700'
                            }`}
                          >
                            <MessageSquare className="w-4 h-4 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium">{conv.title || 'New Chat'}</p>
                              <p className="text-xs text-dark-500">
                                {conv.messageCount} messages
                              </p>
                            </div>
                            <button
                              onClick={(e) => handleDeleteConversation(conv.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-dark-200 dark:hover:bg-dark-600 rounded"
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </button>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Hi! I'm your CRM Assistant
                    </h3>
                    <p className="text-dark-500 text-sm mb-6">
                      I can help you with {currentRole === 'ADMIN' ? 'all CRM data' : currentRole === 'STAFF' ? 'leads, contacts, and tasks' : 'your issues and tasks'}. 
                      Ask me anything!
                    </p>
                    
                    {/* Quick Suggestions */}
                    <div className="w-full max-w-sm space-y-2">
                      <p className="text-xs text-dark-400 mb-2">Try asking:</p>
                      {suggestions.slice(0, 4).map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setInput(suggestion)
                            inputRef.current?.focus()
                          }}
                          className="w-full flex items-center gap-2 p-3 text-left text-sm rounded-xl border border-dark-200 dark:border-dark-700 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-violet-500" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                          {/* Show tools used badge */}
                          {msg.role === 'assistant' && msg.toolsUsed && msg.toolsUsed.length > 0 && (
                            <div className="flex items-center gap-1 mb-1 flex-wrap">
                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                <Database className="w-3 h-3" />
                                Used CRM data
                              </span>
                              {msg.toolsUsed.slice(0, 3).map((tool, i) => (
                                <span 
                                  key={i}
                                  className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                                >
                                  {tool.replace(/_/g, ' ')}
                                </span>
                              ))}
                              {msg.toolsUsed.length > 3 && (
                                <span className="text-xs text-dark-400">
                                  +{msg.toolsUsed.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              msg.role === 'user'
                                ? 'bg-violet-500 text-white rounded-br-md'
                                : 'bg-dark-100 dark:bg-dark-800 rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            <span className="text-xs text-dark-400">
                              {formatTime(msg.timestamp)}
                            </span>
                            {msg.role === 'assistant' && (
                              <button
                                onClick={() => copyToClipboard(msg.content, index)}
                                className="p-1 hover:bg-dark-200 dark:hover:bg-dark-700 rounded"
                                title="Copy"
                              >
                                {copiedIndex === index ? (
                                  <Check className="w-3 h-3 text-green-500" />
                                ) : (
                                  <Copy className="w-3 h-3 text-dark-400" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {/* Loading indicator */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-dark-100 dark:bg-dark-800 rounded-2xl rounded-bl-md px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                              <span className="text-sm text-dark-500">Processing...</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-dark-400">
                              <Database className="w-3 h-3 animate-pulse text-emerald-500" />
                              <span>Querying CRM data with MCP tools</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything about your CRM..."
                      rows={1}
                      className="w-full resize-none rounded-xl border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-800 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      style={{ maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-dark-400 mt-2 text-center flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-500" />
                  MCP-enabled • Real CRM data access • {currentRole} permissions
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AIChatbot

