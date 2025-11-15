import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ClearAllIcon from '@mui/icons-material/ClearAll'

/**
 * Format timestamp to readable format
 */
const formatTimestamp = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Get score color
 */
const getScoreColor = (score) => {
  if (score === 0) return 'success'
  if (score <= 20) return 'success'
  if (score <= 40) return 'info'
  if (score <= 60) return 'warning'
  return 'error'
}

/**
 * HistoryTable Component
 * Displays analysis history from localStorage
 */
function HistoryTable({ history, setHistory }) {
  const handleDelete = (id) => {
    const newHistory = history.filter((item) => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem('ps_history', JSON.stringify(newHistory))
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([])
      localStorage.removeItem('ps_history')
    }
  }

  if (history.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No analysis history yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Your analysis results will appear here
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper elevation={2}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          📜 Analysis History
        </Typography>
        <Button
          startIcon={<ClearAllIcon />}
          onClick={handleClearAll}
          color="error"
          size="small"
        >
          Clear All
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Text Preview</TableCell>
              <TableCell align="center">Privacy Score</TableCell>
              <TableCell align="center">Entities</TableCell>
              <TableCell align="center">Entity Types</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                    {formatTimestamp(item.timestamp)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                    }}
                  >
                    {item.redacted_text}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={item.privacy_score}
                    color={getScoreColor(item.privacy_score)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight={600}>
                    {item.entity_count}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {item.entities.map((entityType, idx) => (
                      <Chip
                        key={idx}
                        label={entityType}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default HistoryTable
