import { useState, useEffect } from 'react'
import { typography, colors } from '../design-tokens.js'

const GREETINGS = [
  "Hello",
  "Hola",
  "Bonjour",
  "Namaste",
  "Konnichiwa",
  "Guten Tag",
  "Ciao",
  "Olá",
  "Ni Hao",
  "Marhaba",
  "Salam"
]

export default function Preloader({ onComplete }) {
  const [index, setIndex] = useState(0)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (index < GREETINGS.length - 1) {
      const timer = setTimeout(() => {
        setIndex(i => i + 1)
      }, 130) // rapid cinematic flash
      return () => clearTimeout(timer)
    } else {
      // Hold on the final greeting briefly, then fade to reveal the 3D world
      const holdTimer = setTimeout(() => {
        setOpacity(0)
        setTimeout(onComplete, 800) // Wait for fade out CSS transition
      }, 400)
      return () => clearTimeout(holdTimer)
    }
  }, [index, onComplete])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#030305',
      zIndex: 9999, // Ensure it covers everything
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity,
      transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: opacity === 0 ? 'none' : 'auto'
    }}>
      <div style={{
        fontFamily: typography.fontSans,
        fontSize: 'clamp(28px, 6vw, 48px)',
        fontWeight: 600,
        color: colors.neutral[100],
        letterSpacing: '0.05em',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        animation: 'panelIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        <div style={{ 
          width: 8, 
          height: 8, 
          borderRadius: '50%', 
          background: colors.accent, 
          boxShadow: `0 0 16px ${colors.accent}` 
        }} />
        {GREETINGS[index]}
      </div>
    </div>
  )
}
