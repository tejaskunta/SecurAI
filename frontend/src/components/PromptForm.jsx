import { useState } from 'react'
import {
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'

function PromptForm({ onSubmit, loading, fullWidth = false }) {
  const [text, setText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim() || loading) return
    
    await onSubmit(text)
    setText('')
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'flex-end',
      }}
    >
      <TextField
        fullWidth
        multiline
        rows={fullWidth ? 6 : 3}
        placeholder="Type your message securely..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: 'rgba(26, 26, 46, 0.8)',
            color: '#ffffff',
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            '&:hover': {
              border: '1px solid rgba(139, 92, 246, 0.5)',
            },
            '&.Mui-focused': {
              border: '1px solid rgba(139, 92, 246, 0.8)',
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading || !text.trim()}
        endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
          textTransform: 'none',
          fontSize: '15px',
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
            boxShadow: '0 15px 40px rgba(139, 92, 246, 0.5)',
          },
          '&.Mui-disabled': {
            background: 'rgba(139, 92, 246, 0.3)',
            color: '#6b7280',
          },
        }}
      >
        Analyze
      </Button>
    </Box>
  )
}

export default PromptForm
