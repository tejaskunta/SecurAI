import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'

/**
 * UnicornBackground Component
 * Animated particle background using Canvas API
 */
function UnicornBackground() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle class
    class Particle {
      constructor() {
        this.reset()
        this.y = Math.random() * canvas.height
        this.fadeDelay = Math.random() * 600
        this.fadeStart = Date.now() + this.fadeDelay
        this.fadingOut = false
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.speed = 0.2 + Math.random() * 0.5
        this.opacity = 0
        this.fadeDelay = Math.random() * 600
        this.fadeStart = Date.now() + this.fadeDelay
        this.fadingOut = false
        this.radius = 1 + Math.random() * 2
        
        // Color palette - blues and purples
        const colors = [
          'rgba(37, 99, 235, ',    // blue-600
          'rgba(124, 58, 237, ',   // violet-600
          'rgba(6, 182, 212, ',    // cyan-600
          'rgba(139, 92, 246, ',   // violet-500
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
        
        this.angle = Math.random() * Math.PI * 2
        this.radius = 1 + Math.random() * 2
      }

      update() {
        // Fade in
        if (Date.now() > this.fadeStart && this.opacity < 1 && !this.fadingOut) {
          this.opacity += 0.01
        }

        this.y -= this.speed
        this.x += Math.sin(this.angle) * 0.3

        // Reset particle when it goes off screen
        if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
          this.reset()
        }

        // Random fade out
        if (Math.random() < 0.001 && this.opacity > 0.3) {
          this.fadingOut = true
        }

        if (this.fadingOut) {
          this.opacity -= 0.02
          if (this.opacity <= 0) {
            this.reset()
          }
        }
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color + this.opacity + ')'
        ctx.fill()

        // Glow effect
        ctx.shadowBlur = 10
        ctx.shadowColor = this.color + this.opacity + ')'
      }
    }

    // Create particles
    const particleCount = 100
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(37, 99, 235, ${
              0.15 * (1 - distance / 150) * particle.opacity * otherParticle.opacity
            })`
            ctx.lineWidth = 1
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
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
        zIndex: -1,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #ddd6fe 100%)',
        pointerEvents: 'none',
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

export default UnicornBackground
