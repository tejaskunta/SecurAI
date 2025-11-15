import { Box, Tooltip } from '@mui/material'

/**
 * Entity color mapping for highlighting
 */
const ENTITY_COLORS = {
  PERSON: '#ff6b6b',
  EMAIL_ADDRESS: '#4ecdc4',
  PHONE_NUMBER: '#45b7d1',
  CREDIT_CARD: '#ffa07a',
  LOCATION: '#98d8c8',
  DATE_TIME: '#f7dc6f',
  IP_ADDRESS: '#bb8fce',
  URL: '#85c1e2',
  US_SSN: '#ff6b6b',
  CRYPTO: '#ffa07a',
  ORGANIZATION: '#a8dadc',
}

/**
 * Get color for entity type
 */
const getEntityColor = (entityType) => {
  return ENTITY_COLORS[entityType] || '#95a5a6'
}

/**
 * EntityHighlighter Component
 * Highlights detected entities in text with proper UTF-16 handling
 */
function EntityHighlighter({ text, entities }) {
  if (!entities || entities.length === 0) {
    return (
      <Box
        sx={{
          p: 2,
          bgcolor: 'rgba(10, 10, 15, 0.6)',
          borderRadius: 1,
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          color: '#d1d5db',
        }}
      >
        {text}
      </Box>
    )
  }

  // Sort entities by start position
  const sortedEntities = [...entities].sort((a, b) => a.start - b.start)

  // Build highlighted text segments
  const segments = []
  let lastIndex = 0

  sortedEntities.forEach((entity, idx) => {
    const { start, end, entity_type, text: entityText, score } = entity

    // Validate indices
    if (start < 0 || end > text.length || start >= end) {
      console.warn('Invalid entity indices:', entity)
      return
    }

    // Add text before entity
    if (start > lastIndex) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, start),
        key: `text-${idx}`,
      })
    }

    // Extract actual text at position
    const actualText = text.substring(start, end)

    // Check for mismatch (UTF-16 encoding issue)
    let displayText = actualText
    if (actualText !== entityText) {
      console.warn(`Entity mismatch: expected "${entityText}", got "${actualText}"`)
      // Try to find the entity text
      const foundIndex = text.indexOf(entityText, lastIndex)
      if (foundIndex !== -1 && foundIndex < start + 50) {
        displayText = entityText
      }
    }

    // Add highlighted entity
    segments.push({
      type: 'entity',
      content: displayText,
      entityType: entity_type,
      score: score,
      key: `entity-${idx}`,
    })

    lastIndex = end
  })

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex),
      key: 'text-end',
    })
  }

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'rgba(10, 10, 15, 0.6)',
        borderRadius: 1,
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 1.8,
        color: '#d1d5db',
      }}
    >
      {segments.map((segment) => {
        if (segment.type === 'text') {
          return <span key={segment.key} style={{ color: '#d1d5db' }}>{segment.content}</span>
        }

        // Highlighted entity
        const color = getEntityColor(segment.entityType)
        return (
          <Tooltip
            key={segment.key}
            title={`${segment.entityType} (${Math.round(segment.score * 100)}% confidence)`}
            arrow
          >
            <span
              style={{
                backgroundColor: color,
                color: '#000',
                padding: '2px 4px',
                borderRadius: '4px',
                fontWeight: 600,
                cursor: 'help',
              }}
            >
              {segment.content}
            </span>
          </Tooltip>
        )
      })}
    </Box>
  )
}

export default EntityHighlighter
