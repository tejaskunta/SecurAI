import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Container,
  Paper,
  IconButton,
} from '@mui/material'
import {
  Logout as LogoutIcon,
} from '@mui/icons-material'
import GradientBackground from '../components/GradientBackground'
import ResultPanel from '../components/ResultPanel'

function DashboardPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    navigate('/')
  }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <GradientBackground />

      {/* Top Navigation Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              🔒
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              securAI
            </Typography>
          </Box>

          <IconButton
            onClick={handleLogout}
            sx={{
              color: '#EC4899',
              '&:hover': {
                bgcolor: 'rgba(236, 72, 153, 0.1)',
              },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#ffffff',
              mb: 2,
            }}
          >
            AI Privacy Analysis
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#a1a1aa',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Secure your prompts with enterprise-grade PII detection before sending to AI
          </Typography>
        </Box>

        {/* AI Chat Panel - Always visible */}
        <ResultPanel />
      </Container>
    </Box>
  )
}

export default DashboardPage
