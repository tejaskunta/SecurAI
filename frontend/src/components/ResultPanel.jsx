import {
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import EntityHighlighter from './EntityHighlighter'
import PrivacyScoreBar from './PrivacyScoreBar'
import ChatInterface from './ChatInterface'

function ResultPanel({ result, offlineMode }) {
  const { 
    original_text, 
    redacted_text, 
    entities, 
    privacy_score, 
    llm_response,
    gemini_response, 
    llm_provider = 'gemini'
  } = result

  // Use llm_response if available, fallback to gemini_response for backward compatibility
  const aiResponse = llm_response || gemini_response

  // Determine the AI provider name for display
  const providerName = llm_provider === 'openai' ? 'OpenAI GPT' : 'Google Gemini'
  const providerColor = llm_provider === 'openai' ? 'success' : 'secondary'

  return (
    <Box>
      {/* Privacy Score */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          🛡️ Privacy Analysis
        </Typography>
        <PrivacyScoreBar score={privacy_score} />
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={entities.length > 0 ? <WarningIcon /> : <CheckCircleIcon />}
            label={`${entities.length} sensitive ${entities.length === 1 ? 'entity' : 'entities'} detected`}
            color={entities.length > 0 ? 'warning' : 'success'}
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Detected Entities */}
      {entities.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            📋 Detected Entities
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {entities.map((entity, index) => (
              <Chip
                key={index}
                label={`${entity.entity_type}: "${entity.text}" (${Math.round(entity.score * 100)}%)`}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* Text Comparison */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'error.main' }}>
                ⚠️ Original Text (Not Sent)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <EntityHighlighter text={original_text} entities={entities} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'success.main' }}>
                ✅ Redacted Text (Sent to AI)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="body1"
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {redacted_text}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Response */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SmartToyIcon color={providerColor} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {providerName} Response
          </Typography>
          <Chip 
            label={llm_provider === 'openai' ? 'OpenAI' : 'Gemini'} 
            size="small" 
            color={providerColor} 
          />
          {offlineMode && (
            <Chip label="Sample Data" size="small" color="warning" />
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography
          variant="body1"
          sx={{
            p: 2,
            bgcolor: llm_provider === 'openai' ? 'success.50' : 'secondary.50',
            borderRadius: 1,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.7,
          }}
        >
          {aiResponse}
        </Typography>
      </Paper>

      {/* Chat Interface for Follow-up Questions */}
      <ChatInterface 
        initialResult={result} 
        llmProvider={llm_provider}
        model={result.model}
      />
    </Box>
  )
}

export default ResultPanel
