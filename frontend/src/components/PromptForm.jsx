import { useState } from 'react'
import {
  Paper,
  TextField,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Chip,
} from '@mui/material'
import {
  AttachFile as AttachFileIcon,
  Upload as UploadIcon,
  Send as SendIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material'
import { analyzeText } from '../api'

function PromptForm({ onResult, onError, loading, setLoading, inline = false }) {
  const [text, setText] = useState('')
  const [llmProvider, setLlmProvider] = useState('gemini')
  const [model, setModel] = useState('')

  const handleTextChange = (e) => {
    setText(e.target.value)
  }

  const handleProviderChange = (e) => {
    const provider = e.target.value
    setLlmProvider(provider)
    // Set default model based on provider
    if (provider === 'openai') {
      setModel('gpt-3.5-turbo')
    } else {
      setModel('gemini-1.5-flash')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!text.trim()) {
      onError('Please enter some text to analyze')
      return
    }

    setLoading(true)

    try {
      const result = await analyzeText(text, llmProvider, model)

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
      <Box sx={{ width: '100%' }}>
        {/* LLM Provider Selection */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Chip
            icon={<PsychologyIcon />}
            label="AI Provider:"
            size="small"
            sx={{ bgcolor: '#FFF5ED', color: '#FF8C42', fontWeight: 600 }}
          />
          <Select
            size="small"
            value={llmProvider}
            onChange={handleProviderChange}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="gemini">Gemini</MenuItem>
            <MenuItem value="openai">OpenAI GPT</MenuItem>
          </Select>
          
          <Select
            size="small"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={loading}
            sx={{ minWidth: 160 }}
          >
            {llmProvider === 'openai' ? (
              <>
                <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                <MenuItem value="gpt-4">GPT-4</MenuItem>
                <MenuItem value="gpt-4-turbo-preview">GPT-4 Turbo</MenuItem>
              </>
            ) : (
              <>
                <MenuItem value="gemini-1.5-flash">Gemini 1.5 Flash</MenuItem>
                <MenuItem value="gemini-1.5-pro">Gemini 1.5 Pro</MenuItem>
              </>
            )}
          </Select>
        </Box>

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
            placeholder="Ask anything with privacy protection..."
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

          <Tooltip title={`Send to ${llmProvider === 'openai' ? 'OpenAI' : 'Gemini'}`}>
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
          </Tooltip>
        </Box>
      </Box>
    )
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>AI Provider</InputLabel>
          <Select
            value={llmProvider}
            label="AI Provider"
            onChange={handleProviderChange}
            disabled={loading}
          >
            <MenuItem value="gemini">Google Gemini</MenuItem>
            <MenuItem value="openai">OpenAI GPT</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Model</InputLabel>
          <Select
            value={model}
            label="Model"
            onChange={(e) => setModel(e.target.value)}
            disabled={loading}
          >
            {llmProvider === 'openai' ? (
              <>
                <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast & Cost-effective)</MenuItem>
                <MenuItem value="gpt-4">GPT-4 (Most Capable)</MenuItem>
                <MenuItem value="gpt-4-turbo-preview">GPT-4 Turbo (Latest)</MenuItem>
              </>
            ) : (
              <>
                <MenuItem value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</MenuItem>
                <MenuItem value="gemini-1.5-pro">Gemini 1.5 Pro (Advanced)</MenuItem>
              </>
            )}
          </Select>
        </FormControl>
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          placeholder="Enter your prompt here... Your sensitive data will be automatically redacted before sending to AI."
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
          {loading ? 'Analyzing & Sending...' : `Analyze & Send to ${llmProvider === 'openai' ? 'OpenAI' : 'Gemini'}`}
        </Button>
      </form>
    </Paper>
  )
}

export default PromptForm
