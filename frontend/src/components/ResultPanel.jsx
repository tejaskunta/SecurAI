import { useState, useRef, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Divider,
  InputAdornment,
  Collapse,
  Avatar,
} from '@mui/material'
import {
  Send as SendIcon,
  Settings as SettingsIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
  SmartToy as SmartToyIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import EntityHighlighter from './EntityHighlighter'
import PrivacyScoreBar from './PrivacyScoreBar'

function ResultPanel({ initialPrompt }) {
  const [apiKey, setApiKey] = useState(localStorage.getItem('geminiApiKey') || '')
  const [tempApiKey, setTempApiKey] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('geminiApiKey'))
  const [showApiKeyValue, setShowApiKeyValue] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [conversationContext, setConversationContext] = useState([]) // Store cleaned conversation for Gemini
  const [userMessage, setUserMessage] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [totalEntitiesDetected, setTotalEntitiesDetected] = useState(0)
  const [privacyScore, setPrivacyScore] = useState(0)
  const [detectedEntitiesWithScores, setDetectedEntitiesWithScores] = useState([])
  const chatEndRef = useRef(null)
  const initialPromptSentRef = useRef(false)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Auto-send initial prompt from home screen
  useEffect(() => {
    if (initialPrompt && !initialPromptSentRef.current && apiKey) {
      initialPromptSentRef.current = true
      // Send the message directly without setting userMessage state
      handleSendMessage(initialPrompt)
      // Clear the input field after sending
      setUserMessage('')
    }
  }, [initialPrompt, apiKey])

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('geminiApiKey', tempApiKey.trim())
      setApiKey(tempApiKey.trim())
      setShowApiKeyInput(false)
      setTempApiKey('')
    }
  }

  const handleRemoveApiKey = () => {
    localStorage.removeItem('geminiApiKey')
    setApiKey('')
    setShowApiKeyInput(true)
  }

  const handleSendMessage = async (messageToSend = null) => {
    const message = messageToSend || userMessage
    // Ensure message is a string
    if (typeof message !== 'string' || !message.trim() || !apiKey || chatLoading) return

    // First, redact PII from the user's message before sending
    let cleanedMessage = message
    let detectedEntities = []
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const cleanResponse = await fetch(`${apiUrl}/v1/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      })

      if (cleanResponse.ok) {
        const cleanData = await cleanResponse.json()
        cleanedMessage = cleanData.redacted_text || message
        detectedEntities = cleanData.entities || []
        
        // Update privacy score and total entities
        setTotalEntitiesDetected(prev => prev + detectedEntities.length)
        if (detectedEntities.length > 0) {
          // Calculate new privacy score: increase by 10 for each entity protected, max 100
          setPrivacyScore(prev => Math.min(100, prev + (detectedEntities.length * 10)))
          
          // Add entities with confidence scores to the list
          setDetectedEntitiesWithScores(prev => [
            ...prev,
            ...detectedEntities.map(entity => ({
              text: entity.text,
              type: entity.entity_type,
              score: entity.score,
              timestamp: new Date().toISOString()
            }))
          ])
        }
        
        // Log for debugging
        console.log('Original message:', message)
        console.log('Cleaned message:', cleanedMessage)
        console.log('Detected entities:', detectedEntities)
      } else {
        console.error('Failed to clean message, status:', cleanResponse.status)
      }
    } catch (error) {
      console.error('Failed to clean message:', error)
    }

    // Show user their original message
    const newUserMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    }

    setChatMessages((prev) => [...prev, newUserMessage])
    
    // Add cleaned message to conversation context for Gemini
    setConversationContext((prev) => [
      ...prev,
      {
        role: 'user',
        parts: [{ text: cleanedMessage }]
      }
    ])
    
    // If PII was detected, show a system message about redaction
    if (detectedEntities.length > 0) {
      const systemMessage = {
        role: 'system',
        content: `🔒 Privacy protection active: Detected and redacted ${detectedEntities.length} sensitive item(s) (${detectedEntities.map(e => e.entity_type).join(', ')}) before sending to AI.`,
        timestamp: new Date().toISOString(),
      }
      setChatMessages((prev) => [...prev, systemMessage])
    }
    
    setUserMessage('')
    setChatLoading(true)

    try {
      // Build conversation history with the cleaned/redacted messages
      const conversationHistory = [
        ...conversationContext,
        {
          role: 'user',
          parts: [{ text: cleanedMessage }]
        }
      ]

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: conversationHistory,
            generationConfig: {
              temperature: 0.9,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              }
            ]
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errorMessage = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      // Validate response structure
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No candidates returned from Gemini API')
      }

      const candidate = data.candidates[0]
      
      // Check if response was blocked by safety filters
      if (candidate.finishReason === 'SAFETY') {
        throw new Error('Response blocked by safety filters. Try rephrasing your message.')
      }

      const aiResponse = candidate?.content?.parts?.[0]?.text

      if (!aiResponse) {
        throw new Error('Empty response from Gemini API')
      }

      const newAiMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      }

      setChatMessages((prev) => [...prev, newAiMessage])
      
      // Add AI response to conversation context for multi-turn conversation
      setConversationContext((prev) => [
        ...prev,
        {
          role: 'model', // Gemini uses 'model' for assistant responses
          parts: [{ text: aiResponse }]
        }
      ])
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `❌ Error: ${error.message}. Please check your API key and try again.`,
        timestamp: new Date().toISOString(),
        isError: true,
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setChatLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Box>
      {/* Compact Analysis Card */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: 'rgba(26, 26, 46, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: 3,
        }}
      >
        {/* Privacy Score */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#ffffff',
              mb: 2,
            }}
          >
            🛡️ Privacy Analysis
          </Typography>
          <PrivacyScoreBar score={privacyScore} />
          
          {/* Redacted Entities with Confidence Scores */}
          {detectedEntitiesWithScores.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#ffffff', 
                  mb: 1.5,
                  fontWeight: 600 
                }}
              >
                🔒 Redacted Information
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                maxHeight: '200px',
                overflowY: 'auto',
                p: 2,
                bgcolor: 'rgba(10, 10, 15, 0.4)',
                borderRadius: 2,
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}>
                {detectedEntitiesWithScores.map((entity, index) => (
                  <Chip
                    key={index}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 600,
                            color: '#ffffff'
                          }}
                        >
                          {entity.text}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#a1a1aa',
                            fontSize: '0.7rem'
                          }}
                        >
                          ({entity.type})
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#6ee7b7',
                            fontSize: '0.7rem',
                            fontWeight: 700
                          }}
                        >
                          {(entity.score * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    }
                    size="small"
                    sx={{
                      bgcolor: 'rgba(139, 92, 246, 0.15)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      color: '#ffffff',
                      '& .MuiChip-label': {
                        px: 1.5,
                        py: 0.5,
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {/* Entities Summary */}
          {totalEntitiesDetected > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 1.5 }}>
                📋 Total Entities Detected: {totalEntitiesDetected}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6ee7b7', fontSize: '0.85rem' }}>
                Your messages are being automatically redacted before sending to AI
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* ChatGPT-Style LLM Chat Interface */}
      <Paper
        elevation={0}
        sx={{
          background: 'rgba(26, 26, 46, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(236, 72, 153, 0.3)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid rgba(236, 72, 153, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SmartToyIcon sx={{ color: '#EC4899', fontSize: 28 }} />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
                AI Chat Assistant
              </Typography>
              <Typography variant="caption" sx={{ color: '#a1a1aa', display: 'block' }}>
                Powered by Google Gemini
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#86efac',
                  display: 'block',
                  mt: 0.5,
                  fontStyle: 'italic'
                }}
              >
                🔒 Run any prompts here - they'll be cleaned up and sent to Gemini protecting your data
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            sx={{
              color: '#EC4899',
              '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.1)' },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>

        {/* API Key Configuration */}
        <Collapse in={showApiKeyInput}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'rgba(10, 10, 15, 0.4)',
              borderBottom: '1px solid rgba(236, 72, 153, 0.2)',
            }}
          >
            <Typography variant="body2" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
              🔑 Configure API Key
            </Typography>
            <Typography variant="caption" sx={{ color: '#a1a1aa', mb: 2, display: 'block' }}>
              Enter your Google Gemini API key to start chatting. Get one at:{' '}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#EC4899' }}
              >
                makersuite.google.com
              </a>
            </Typography>
            
            {apiKey ? (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  size="small"
                  type={showApiKeyValue ? 'text' : 'password'}
                  value={apiKey}
                  disabled
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowApiKeyValue(!showApiKeyValue)}
                          sx={{ color: '#a1a1aa' }}
                        >
                          {showApiKeyValue ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(26, 26, 46, 0.8)',
                      color: '#d1d5db',
                      fontSize: '0.875rem',
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={handleRemoveApiKey}
                  sx={{
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#dc2626',
                      bgcolor: 'rgba(239, 68, 68, 0.1)',
                    },
                  }}
                >
                  Remove
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  placeholder="Paste your API key here..."
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveApiKey()
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(26, 26, 46, 0.8)',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSaveApiKey}
                  disabled={!tempApiKey.trim()}
                  sx={{
                    px: 3,
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                    },
                  }}
                >
                  Save
                </Button>
              </Box>
            )}
          </Box>
        </Collapse>

        {/* Chat Messages Area */}
        <Box
          sx={{
            height: '500px',
            overflowY: 'auto',
            p: 3,
            bgcolor: 'rgba(10, 10, 15, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {!apiKey && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
              }}
            >
              <SmartToyIcon sx={{ fontSize: 60, color: '#6b7280', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#a1a1aa', mb: 1 }}>
                Welcome to AI Chat
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                Please configure your API key to start chatting
              </Typography>
              <Button
                variant="contained"
                startIcon={<SettingsIcon />}
                onClick={() => setShowApiKeyInput(true)}
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Add API Key
              </Button>
            </Box>
          )}

          {apiKey && chatMessages.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
              }}
            >
              <SmartToyIcon sx={{ fontSize: 60, color: '#EC4899', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                Start a Conversation
              </Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                Ask questions about your redacted text or anything else!
              </Typography>
            </Box>
          )}

          {chatMessages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              {/* System messages (privacy notifications) don't show avatar */}
              {msg.role !== 'system' && (
                <Avatar
                  sx={{
                    bgcolor:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                        : 'rgba(236, 72, 153, 0.2)',
                    width: 36,
                    height: 36,
                  }}
                >
                  {msg.role === 'user' ? (
                    <PersonIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <SmartToyIcon sx={{ fontSize: 20, color: '#EC4899' }} />
                  )}
                </Avatar>
              )}

              <Box
                sx={{
                  flex: 1,
                  maxWidth: msg.role === 'system' ? '100%' : '75%',
                }}
              >
                {msg.role !== 'system' && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#a1a1aa',
                      display: 'block',
                      mb: 0.5,
                      textAlign: msg.role === 'user' ? 'right' : 'left',
                    }}
                  >
                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                  </Typography>
                )}
                <Box
                  sx={{
                    p: msg.role === 'system' ? 1.5 : 2,
                    bgcolor:
                      msg.role === 'system'
                        ? 'rgba(34, 197, 94, 0.1)' // Green for system messages
                        : msg.role === 'user'
                        ? 'rgba(139, 92, 246, 0.2)'
                        : msg.isError
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(26, 26, 46, 0.6)',
                    border:
                      msg.role === 'system'
                        ? '1px solid rgba(34, 197, 94, 0.3)'
                        : msg.role === 'user'
                        ? '1px solid rgba(139, 92, 246, 0.3)'
                        : msg.isError
                        ? '1px solid rgba(239, 68, 68, 0.3)'
                        : '1px solid rgba(236, 72, 153, 0.3)',
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant={msg.role === 'system' ? 'caption' : 'body2'}
                    sx={{
                      color: msg.role === 'system' ? '#86efac' : '#d1d5db',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                      wordBreak: 'break-word',
                      fontStyle: msg.role === 'system' ? 'italic' : 'normal',
                    }}
                  >
                    {msg.content}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}

          {chatLoading && (
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'rgba(236, 72, 153, 0.2)',
                  width: 36,
                  height: 36,
                }}
              >
                <SmartToyIcon sx={{ fontSize: 20, color: '#EC4899' }} />
              </Avatar>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'rgba(26, 26, 46, 0.6)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CircularProgress size={8} sx={{ color: '#EC4899' }} />
                  <CircularProgress size={8} sx={{ color: '#EC4899', animationDelay: '0.2s' }} />
                  <CircularProgress size={8} sx={{ color: '#EC4899', animationDelay: '0.4s' }} />
                </Box>
              </Box>
            </Box>
          )}

          <div ref={chatEndRef} />
        </Box>

        {/* Chat Input */}
        <Box
          sx={{
            p: 3,
            borderTop: '1px solid rgba(236, 72, 153, 0.2)',
            bgcolor: 'rgba(10, 10, 15, 0.3)',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder={
                apiKey
                  ? 'Type your message...'
                  : 'Please add your API key to start chatting'
              }
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!apiKey || chatLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(26, 26, 46, 0.8)',
                  color: '#ffffff',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  borderRadius: 2,
                  '&:hover': {
                    border: '1px solid rgba(236, 72, 153, 0.5)',
                  },
                  '&.Mui-focused': {
                    border: '1px solid rgba(236, 72, 153, 0.8)',
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => handleSendMessage()}
              disabled={!apiKey || !userMessage.trim() || chatLoading}
              sx={{
                px: 3,
                py: 1.5,
                minWidth: 'auto',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                boxShadow: '0 5px 20px rgba(236, 72, 153, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                  boxShadow: '0 8px 25px rgba(236, 72, 153, 0.4)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(139, 92, 246, 0.3)',
                  color: '#6b7280',
                },
              }}
            >
              {chatLoading ? <CircularProgress size={24} /> : <SendIcon />}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default ResultPanel
