import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  Divider,
  Paper,
  Avatar,
  Chip,
} from '@mui/material'
import {
  Add as AddIcon,
  History as HistoryIcon,
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  Search as SearchIcon,
  AttachFile as AttachFileIcon,
  Upload as UploadIcon,
  Send as SendIcon,
  Shield as ShieldIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  ChecklistRtl as ChecklistIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import PromptForm from './components/PromptForm'
import ResultPanel from './components/ResultPanel'

const drawerWidth = 280

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [projects, setProjects] = useState([
    'Atoll Construction',
    'Le Amore', 
    'Realize MGHT',
    'SY-CL',
    'Cerebrum Inc.'
  ])
  const [activeProject, setActiveProject] = useState(null)

  const handleAnalyze = (data) => {
    setResult(data)
    setError(null)
    setShowAnalysis(true)
  }

  const handleError = (err) => {
    setError(err)
    setResult(null)
  }

  const handleNewAnalysis = () => {
    setShowAnalysis(false)
    setResult(null)
    setError(null)
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#F5F5F5' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'white',
            borderRight: '1px solid #E0E0E0',
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: '#FF8C42', width: 32, height: 32 }}>
            <ShieldIcon sx={{ fontSize: 20 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            securAI
          </Typography>
        </Box>

        {/* New Agent Button */}
        <Box sx={{ px: 2, mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewAnalysis}
            sx={{
              bgcolor: '#FF8C42',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              '&:hover': { bgcolor: '#E67A35' },
            }}
          >
            New Analysis
          </Button>
        </Box>

        {/* Search */}
        <Box sx={{ px: 2, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: '#999' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#F9F9F9',
                '& fieldset': { border: 'none' },
              },
            }}
          />
        </Box>

        <Divider />

        {/* Menu Items */}
        <List sx={{ px: 1 }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Dashboards" />
            </ListItemButton>
          </ListItem>

          {/* Works Section */}
          <ListItem disablePadding sx={{ mt: 2 }}>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FolderIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Projects" />
            </ListItemButton>
          </ListItem>
          
          {projects.map((project) => (
            <ListItem key={project} disablePadding>
              <ListItemButton
                selected={activeProject === project}
                onClick={() => setActiveProject(project)}
                sx={{
                  pl: 5,
                  '&.Mui-selected': {
                    bgcolor: '#FFF5ED',
                    color: '#FF8C42',
                  },
                }}
              >
                <ListItemText 
                  primary={project}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Premium Plan Card */}
        <Box sx={{ p: 2, mt: 'auto', mb: 2 }}>
          <Paper
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
              color: 'white',
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Premium Plan
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mb: 2, opacity: 0.9 }}>
              Upgrade to Premium Plan to Unlock More Features You Need!
            </Typography>
            <Button
              fullWidth
              variant="contained"
              size="small"
              sx={{
                bgcolor: 'white',
                color: '#FF8C42',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: '#F5F5F5' },
              }}
            >
              Upgrade Premium
            </Button>
          </Paper>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'white',
            borderBottom: '1px solid #E0E0E0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label="Upgrade Plan" size="small" sx={{ bgcolor: '#FFF5ED', color: '#FF8C42', fontWeight: 600 }} />
            <Chip label="History" size="small" icon={<HistoryIcon />} variant="outlined" />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 7.5L10 12.5L5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </IconButton>
          </Box>
        </Box>

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 4 }}>
          {!showAnalysis ? (
            // Welcome Screen
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80%',
                textAlign: 'center',
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#FF8C42',
                  mb: 3,
                }}
              >
                <ShieldIcon sx={{ fontSize: 40 }} />
              </Avatar>

              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Welcome to securAI - Your AI Copilot Awaits.
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Discover smarter conversations, automated insights, and limitless creativity — all in one dashboard.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Let's set you up in just a few steps.
              </Typography>

              {/* Input Area */}
              <Paper
                sx={{
                  width: '100%',
                  maxWidth: 700,
                  p: 2,
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <PromptForm
                  onResult={handleAnalyze}
                  onError={handleError}
                  loading={loading}
                  setLoading={setLoading}
                  inline={true}
                />
              </Paper>

              {/* Template Cards */}
              <Box sx={{ mt: 6, width: '100%', maxWidth: 900 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Find Your Template Chats AI
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
                  {[
                    { icon: <PersonIcon />, text: 'Analyze employee data with PII protection' },
                    { icon: <EmailIcon />, text: 'Draft secure emails for sensitive information' },
                    { icon: <ChecklistIcon />, text: 'Generate reports with automatic redaction' },
                  ].map((template, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Avatar sx={{ bgcolor: '#FFF5ED', color: '#FF8C42' }}>
                        {template.icon}
                      </Avatar>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {template.text}
                      </Typography>
                      <IconButton size="small">
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </Box>
          ) : (
            // Analysis Results
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  PII Analysis Results
                </Typography>
                <IconButton onClick={handleNewAnalysis}>
                  <CloseIcon />
                </IconButton>
              </Box>
              
              {result && <ResultPanel result={result} />}
              
              {error && (
                <Paper sx={{ p: 3, bgcolor: '#FFEBEE', color: '#C62828' }}>
                  <Typography variant="body1">{error}</Typography>
                </Paper>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default App
