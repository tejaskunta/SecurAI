import { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material'
import {
  Send as SendIcon,
  Person as PersonIcon,
  SmartToy as SmartToyIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material'
import { analyzeText } from '../api'

/**
 * ChatInterface - Allows follow-up conversations with privacy protection
 * Each message is analyzed and redacted before sending to LLM
 */
function ChatInterface({ initialResult, llmProvider, model }) {
  const [messages, setMessages] = useState([
    {
      role: 'user',
      content: initialResult.original_text,
      redacted: initialResult.redacted_text,
      entities: initialResult.entities,
      privacyScore: initialResult.privacy_score,
    },
    {
      role: 'assistant',
      content: initialResult.llm_response || initialResult.gemini_response,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    try {
      // Analyze and send the message
      const result = await analyzeText(userMessage, llmProvider, model)

      if (result.success) {
        // Add user message with PII analysis
        setMessages((prev) => [
          ...prev,
          {
            role: 'user',
            content: userMessage,
            redacted: result.data.redacted_text,
            entities: result.data.entities,
            privacyScore: result.data.privacy_score,
          },
          {
            role: 'assistant',
            content: result.data.llm_response || result.data.gemini_response,
          },
        ])
      } else {
        // Error handling
        setMessages((prev) => [
          ...prev,
          {
            role: 'user',
            content: userMessage,
          },
          {
            role: 'assistant',
            content: `⚠️ Error: ${result.error || 'Failed to get response'}`,
            error: true,
          },
        ])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ An unexpected error occurred. Please try again.',
          error: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <SmartToyIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Continue Conversation
        </Typography>
        <Chip
          label={`${llmProvider === 'openai' ? 'OpenAI' : 'Gemini'}`}
          size="small"
          color="primary"
        />
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Chat Messages */}
      <Box
        sx={{
          maxHeight: 400,
          overflowY: 'auto',
          mb: 2,
          p: 2,
          bgcolor: '#F9F9F9',
          borderRadius: 2,
        }}
      >
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            {msg.role === 'user' ? (
              // User message
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Avatar sx={{ bgcolor: '#FF8C42', width: 32, height: 32 }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    You
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'white',
                      borderRadius: 2,
                      mt: 0.5,
                    }}
                  >
                    <Typography variant="body2">{msg.content}</Typography>
                    {msg.entities && msg.entities.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                        <ShieldIcon fontSize="small" color="warning" />
                        <Typography variant="caption" color="text.secondary">
                          {msg.entities.length} sensitive {msg.entities.length === 1 ? 'item' : 'items'} redacted
                        </Typography>
                        <Chip
                          label={`Privacy: ${msg.privacyScore}%`}
                          size="small"
                          color={msg.privacyScore > 50 ? 'error' : 'warning'}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    )}
                  </Paper>
                </Box>
              </Box>
            ) : (
              // Assistant message
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', ml: 5 }}>
                <Avatar sx={{ bgcolor: '#2196F3', width: 32, height: 32 }}>
                  <SmartToyIcon fontSize="small" />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    AI Assistant
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: msg.error ? '#FFEBEE' : '#E3F2FD',
                      borderRadius: 2,
                      mt: 0.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            )}
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 5, mt: 2 }}>
            <Avatar sx={{ bgcolor: '#2196F3', width: 32, height: 32 }}>
              <SmartToyIcon fontSize="small" />
            </Avatar>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              AI is thinking...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Input Area */}
      <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask a follow-up question (your data will be protected)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          multiline
          maxRows={3}
        />
        <IconButton
          type="submit"
          disabled={loading || !input.trim()}
          sx={{
            bgcolor: loading || !input.trim() ? '#E0E0E0' : '#FF8C42',
            color: 'white',
            '&:hover': {
              bgcolor: loading || !input.trim() ? '#E0E0E0' : '#E67A35',
            },
            '&.Mui-disabled': {
              bgcolor: '#E0E0E0',
              color: 'white',
            },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        </IconButton>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        💡 Tip: Each message is analyzed for PII and redacted automatically before sending to the AI.
      </Typography>
    </Paper>
  )
}

export default ChatInterface
