import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
} from '@mui/material'
import { 
  ArrowForward as ArrowForwardIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material'
import {
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CloudDone as CloudIcon,
  VerifiedUser as VerifiedIcon,
  AutoAwesome as AutoAwesomeIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material'
import GradientBackground from '../components/GradientBackground'

function LoginPage() {
  const navigate = useNavigate()
  const [quickPrompt, setQuickPrompt] = useState('')

  const handleGetStarted = () => {
    localStorage.setItem('isAuthenticated', 'true')
    navigate('/dashboard')
  }

  const handleQuickPrompt = (e) => {
    e.preventDefault()
    if (quickPrompt.trim()) {
      localStorage.setItem('isAuthenticated', 'true')
      navigate('/dashboard', { state: { initialPrompt: quickPrompt } })
    }
  }

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#8B5CF6' }} />,
      title: 'Advanced PII Detection',
      description: 'Automatically detect and redact sensitive information like emails, phone numbers, addresses, and more.',
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: '#EC4899' }} />,
      title: 'AI-Powered Analysis',
      description: 'Leverage Google Gemini AI to intelligently analyze and process your data with state-of-the-art accuracy.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#8B5CF6' }} />,
      title: 'Real-Time Processing',
      description: 'Get instant results with our high-performance engine that processes thousands of requests per second.',
    },
    {
      icon: <CloudIcon sx={{ fontSize: 40, color: '#EC4899' }} />,
      title: 'Cloud-Native',
      description: 'Built with modern cloud architecture for maximum scalability, reliability, and performance.',
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 40, color: '#8B5CF6' }} />,
      title: 'GDPR Compliant',
      description: 'Fully compliant with GDPR, CCPA, and other privacy regulations to keep your data protected.',
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 40, color: '#EC4899' }} />,
      title: 'Privacy Insights',
      description: 'Get detailed privacy scores and analytics to understand your data exposure and improve security.',
    },
  ]

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', pb: 8 }}>
      <GradientBackground />
      
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 15 }, pb: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4)',
              }}
            >
              🔒
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              securAI
            </Typography>
          </Box>
          
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#ffffff',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
            }}
          >
            Privacy-First AI Platform
            <br />
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Built To Protect
            </Box>
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: '#a1a1aa',
              mb: 5,
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Secure your sensitive data with enterprise-grade PII detection and AI-powered redaction.
            Protect privacy while leveraging cutting-edge artificial intelligence.
          </Typography>

          {/* Quick Prompt Input */}
          <Box
            component="form"
            onSubmit={handleQuickPrompt}
            sx={{
              maxWidth: '600px',
              mx: 'auto',
              mb: 4,
            }}
          >
            <TextField
              fullWidth
              placeholder="Try it now: Enter your text to analyze..."
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleQuickPrompt(e)
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={handleQuickPrompt}
                      disabled={!quickPrompt.trim()}
                      sx={{
                        minWidth: 'auto',
                        p: 1,
                        color: '#8B5CF6',
                        '&:hover': {
                          bgcolor: 'rgba(139, 92, 246, 0.1)',
                        },
                      }}
                    >
                      <ArrowForwardIcon />
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(26, 26, 46, 0.8)',
                  color: '#ffffff',
                  borderRadius: 3,
                  fontSize: '1rem',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  '&:hover': {
                    border: '1px solid rgba(139, 92, 246, 0.5)',
                  },
                  '&.Mui-focused': {
                    border: '1px solid rgba(139, 92, 246, 0.8)',
                    boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              onClick={handleGetStarted}
              variant="contained"
              size="large"
              sx={{
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: '#ffffff',
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 10px 40px rgba(139, 92, 246, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                  boxShadow: '0 15px 50px rgba(139, 92, 246, 0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get Started Free
            </Button>
            
            <Tooltip
              title={
                <Box sx={{ p: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    📝 Quick Start Guide
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    1️⃣ Click "Get Started" or use quick prompt above
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    2️⃣ Enter or paste text containing sensitive information
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    3️⃣ Click "Analyze" to detect and redact PII
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    4️⃣ View privacy score, detected entities, and redacted text
                  </Typography>
                  <Typography variant="body2">
                    5️⃣ Chat with AI using your redacted text safely
                  </Typography>
                </Box>
              }
              arrow
              placement="bottom"
              sx={{
                '& .MuiTooltip-tooltip': {
                  bgcolor: 'rgba(26, 26, 46, 0.98)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  maxWidth: 400,
                },
                '& .MuiTooltip-arrow': {
                  color: 'rgba(26, 26, 46, 0.98)',
                },
              }}
            >
              <IconButton
                sx={{
                  color: '#8B5CF6',
                  '&:hover': {
                    bgcolor: 'rgba(139, 92, 246, 0.1)',
                    color: '#EC4899',
                  },
                }}
              >
                <HelpOutlineIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, mt: 8 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            mb: 2,
          }}
        >
          Key Features
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#a1a1aa',
            textAlign: 'center',
            mb: 6,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          Everything you need to protect sensitive data and maintain privacy compliance
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(26, 26, 46, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    border: '1px solid rgba(139, 92, 246, 0.5)',
                    boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#ffffff',
                      mb: 1.5,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#a1a1aa',
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, mt: 12 }}>
        <Box
          sx={{
            background: 'rgba(26, 26, 46, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: 4,
            p: 6,
          }}
        >
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                99.9%
              </Typography>
              <Typography sx={{ color: '#a1a1aa', fontWeight: 500 }}>
                Detection Accuracy
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                &lt;100ms
              </Typography>
              <Typography sx={{ color: '#a1a1aa', fontWeight: 500 }}>
                Average Response Time
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                15+
              </Typography>
              <Typography sx={{ color: '#a1a1aa', fontWeight: 500 }}>
                PII Entity Types
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, mt: 12, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#ffffff',
            mb: 2,
          }}
        >
          Ready to secure your data?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#a1a1aa',
            mb: 4,
          }}
        >
          Start protecting sensitive information with AI-powered privacy today
        </Typography>
        <Button
          onClick={handleGetStarted}
          variant="contained"
          size="large"
          sx={{
            px: 6,
            py: 2.5,
            fontSize: '1.2rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            color: '#ffffff',
            borderRadius: 3,
            textTransform: 'none',
            boxShadow: '0 10px 40px rgba(139, 92, 246, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
              boxShadow: '0 15px 50px rgba(139, 92, 246, 0.5)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Launch Platform
        </Button>
      </Container>
    </Box>
  )
}

export default LoginPage
