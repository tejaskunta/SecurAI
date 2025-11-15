import { Box, Typography, LinearProgress } from '@mui/material'

/**
 * Get color based on privacy score
 */
const getScoreColor = (score) => {
  if (score === 0) return 'success'
  if (score <= 20) return 'success'
  if (score <= 40) return 'info'
  if (score <= 60) return 'warning'
  return 'error'
}

/**
 * Get description based on privacy score
 */
const getScoreDescription = (score) => {
  if (score === 0) return 'No sensitive data detected'
  if (score <= 20) return 'Low privacy risk'
  if (score <= 40) return 'Moderate privacy risk'
  if (score <= 60) return 'High privacy risk'
  if (score <= 80) return 'Very high privacy risk'
  return 'Critical privacy risk'
}

/**
 * PrivacyScoreBar Component
 * Displays privacy score with color-coded progress bar
 */
function PrivacyScoreBar({ score }) {
  const color = getScoreColor(score)
  const description = getScoreDescription(score)

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight={600}>
          Privacy Score
        </Typography>
        <Typography variant="body2" fontWeight={700} color={`${color}.main`}>
          {score}/100
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={score}
        color={color}
        sx={{
          height: 10,
          borderRadius: 5,
          bgcolor: 'grey.200',
          mb: 1,
        }}
      />

      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  )
}

export default PrivacyScoreBar
