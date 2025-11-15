import { useState } from 'react'
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import InfoIcon from '@mui/icons-material/Info'
import { analyzeText } from '../api'

function PromptForm({ onResult, onError, onOffline, loading, setLoading }) {
  const [text, setText] = useState('')
  const [charCount, setCharCount] = useState(0)

  const handleTextChange = (e) => {
    const value = e.target.value
    setText(value)
    setCharCount(value.length)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!text.trim()) {
      onError('Please enter some text to analyze')
      return
    }

    setLoading(true)

    try {
      const result = await analyzeText(text)

      if (result.success) {
        onResult(result.data)
      } else if (result.offline) {
        onOffline(result.data)
      } else {
        onError(result.error || 'Failed to analyze text')
      }
    } catch (error) {
      onError('Unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleUseSample = () => {
    setText(
      'My name is John Doe and my email is john.doe@company.com. You can call me at 555-0123. I live at 123 Main St, New York, NY 10001.'
    )
    setCharCount(135)
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        🔍 Analyze Your Prompt
      </Typography>

      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        Enter any text below. We'll detect PII (names, emails, phone numbers, etc.), redact it, 
        and send ONLY the redacted version to Gemini AI for processing.
      </Alert>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          placeholder="Enter your prompt here... (e.g., 'My name is Sarah and my email is sarah@example.com')"
          value={text}
          onChange={handleTextChange}
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {charCount} characters
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={handleUseSample}
            disabled={loading}
          >
            Use Sample Text
          </Button>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading || !text.trim()}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          sx={{ py: 1.5 }}
        >
          {loading ? 'Analyzing...' : 'Analyze Prompt'}
        </Button>
      </form>
    </Paper>
  )
}

export default PromptForm
