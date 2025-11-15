import { useState } from 'react'
import {
  Paper,
  TextField,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material'
import {
  AttachFile as AttachFileIcon,
  Upload as UploadIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import { analyzeText } from '../api'

function PromptForm({ onResult, onError, loading, setLoading, inline = false }) {
  const [text, setText] = useState('')

  const handleTextChange = (e) => {
    setText(e.target.value)
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
        setText('') // Clear after successful analysis
      } else {
        onError(result.error || 'Failed to analyze text')
      }
    } catch (error) {
      onError('Unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (inline) {
    return (
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
        }}
      >
        <IconButton size="small" disabled={loading}>
          <AttachFileIcon />
        </IconButton>
        <IconButton size="small" disabled={loading}>
          <UploadIcon />
        </IconButton>
        
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Ask anything OmniAI..."
          value={text}
          onChange={handleTextChange}
          disabled={loading}
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '0.95rem',
            },
          }}
        />

        <IconButton
          type="submit"
          disabled={loading || !text.trim()}
          sx={{
            bgcolor: loading || !text.trim() ? '#E0E0E0' : '#FF8C42',
            color: 'white',
            '&:hover': {
              bgcolor: loading || !text.trim() ? '#E0E0E0' : '#E67A35',
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
    )
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          placeholder="Enter your prompt here..."
          value={text}
          onChange={handleTextChange}
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading || !text.trim()}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          sx={{
            py: 1.5,
            bgcolor: '#FF8C42',
            '&:hover': { bgcolor: '#E67A35' },
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze Prompt'}
        </Button>
      </form>
    </Paper>
  )
}

export default PromptForm
