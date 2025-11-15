import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Alert,
  Paper,
  Tab,
  Tabs,
} from '@mui/material'
import ShieldIcon from '@mui/icons-material/Shield'
import PromptForm from './components/PromptForm'
import ResultPanel from './components/ResultPanel'
import HistoryTable from './components/HistoryTable'
import { UnicornBackground } from './unicornstudio'

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [offlineMode, setOfflineMode] = useState(false)
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState(0)

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ps_history')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Failed to parse history:', e)
      }
    }
  }, [])

  // Save to history
  const saveToHistory = (data) => {
    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      redacted_text: data.redacted_text,
      privacy_score: data.privacy_score,
      entity_count: data.entities.length,
      entities: data.entities.map(e => e.entity_type),
    }

    const newHistory = [historyItem, ...history].slice(0, 20) // Keep last 20
    setHistory(newHistory)
    localStorage.setItem('ps_history', JSON.stringify(newHistory))
  }

  const handleAnalyze = (data) => {
    setResult(data)
    setError(null)
    setOfflineMode(false)
    saveToHistory(data)
  }

  const handleError = (err) => {
    setError(err)
    setResult(null)
  }

  const handleOffline = (sampleData) => {
    setResult(sampleData)
    setOfflineMode(true)
    setError(null)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Animated Background */}
      <UnicornBackground />

      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main', position: 'relative', zIndex: 10 }}>
        <Toolbar>
          <ShieldIcon sx={{ mr: 2, fontSize: 32 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
              securAI
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Secure AI Prompts with PII Detection & Redaction
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Team: CodeRed
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Offline Mode Alert */}
      {offlineMode && (
        <Alert severity="warning" sx={{ borderRadius: 0 }}>
          ⚠️ OFFLINE MODE: Backend unavailable. Displaying sample data for demonstration.
        </Alert>
      )}

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Analyze Prompt" />
            <Tab label={`History (${history.length})`} />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        {activeTab === 0 && (
          <>
            {/* Prompt Form */}
            <PromptForm
              onResult={handleAnalyze}
              onError={handleError}
              onOffline={handleOffline}
              loading={loading}
              setLoading={setLoading}
            />

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}

            {/* Results */}
            {result && (
              <Box sx={{ mt: 4 }}>
                <ResultPanel result={result} offlineMode={offlineMode} />
              </Box>
            )}
          </>
        )}

        {activeTab === 1 && (
          <HistoryTable history={history} setHistory={setHistory} />
        )}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          securAI v1.0 | Built with FastAPI + React + Presidio | Team CodeRed
        </Typography>
      </Box>
    </Box>
  )
}

export default App
