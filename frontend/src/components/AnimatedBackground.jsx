import { useEffect, useRef } from 'react'
import { Box, Typography } from '@mui/material'

function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let circles = []

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Circle class with gradient colors
    class Circle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.radius = Math.random() * 60 + 20
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        this.opacity = Math.random() * 0.15 + 0.05
        // Random gradient colors in orange/red spectrum
        this.color1 = `rgba(${Math.floor(Math.random() * 55) + 200}, ${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 50) + 50}, ${this.opacity})`
        this.color2 = `rgba(${Math.floor(Math.random() * 55) + 200}, ${Math.floor(Math.random() * 50) + 50}, ${Math.floor(Math.random() * 50) + 30}, ${this.opacity * 0.5})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.speedX = -this.speedX
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        )
        gradient.addColorStop(0, this.color1)
        gradient.addColorStop(1, this.color2)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initialize circles
    const initCircles = () => {
      circles = []
      const numberOfCircles = Math.floor((canvas.width * canvas.height) / 50000)
      for (let i = 0; i < numberOfCircles; i++) {
        circles.push(new Circle())
      }
    }
    initCircles()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      circles.forEach((circle) => {
        circle.update()
        circle.draw()
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
        bgcolor: '#FFFFFF',
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
      
      {/* Subtle explanatory text */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      >
        <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem', fontWeight: 500 }}>
          End-to-end PII protection • Real-time detection • Zero data retention
        </Typography>
      </Box>
    </Box>
  )
}

export default AnimatedBackground
