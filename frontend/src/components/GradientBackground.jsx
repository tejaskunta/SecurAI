import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'

function GradientBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let time = 0

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Dark theme with purple/pink glow orbs
    const orbs = [
      { x: 0.2, y: 0.3, radius: 400, color: { r: 139, g: 92, b: 246, a: 0.3 } },  // Purple
      { x: 0.8, y: 0.6, radius: 350, color: { r: 236, g: 72, b: 153, a: 0.25 } }, // Pink
      { x: 0.5, y: 0.8, radius: 300, color: { r: 168, g: 85, b: 247, a: 0.2 } },  // Light purple
    ]

    const animate = () => {
      time += 0.001

      // Dark background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      bgGradient.addColorStop(0, '#0a0a0f')
      bgGradient.addColorStop(0.5, '#0f0f1a')
      bgGradient.addColorStop(1, '#1a1a2e')
      
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw glowing orbs with animation
      orbs.forEach((orb, index) => {
        const offsetX = Math.sin(time + index) * 50
        const offsetY = Math.cos(time * 0.8 + index) * 30
        
        const x = orb.x * canvas.width + offsetX
        const y = orb.y * canvas.height + offsetY
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, orb.radius)
        const { r, g, b, a } = orb.color
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`)
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${a * 0.3})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  )
}

export default GradientBackground
