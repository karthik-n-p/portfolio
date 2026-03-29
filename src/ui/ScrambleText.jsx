import { useState, useEffect } from 'react'

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0x8F%$#@!&*?'

export default function ScrambleText({ text, speed = 30, delay = 0, style, className }) {
  const [displayText, setDisplayText] = useState('')
  const [isScrambling, setIsScrambling] = useState(false)

  useEffect(() => {
    let timeoutId
    let intervalId
    let frameId
    let isMounted = true

    const scramble = () => {
      setIsScrambling(true)
      let iteration = 0
      const totalIterations = text.length * 2

      const tick = () => {
        if (!isMounted) return

        let scrambled = text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ' // Don't scramble spaces
            if (i < iteration / 2) {
              return text[i] // locked character
            }
            // random hacker character
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')

        setDisplayText(scrambled)

        if (iteration >= totalIterations) {
          setIsScrambling(false)
          setDisplayText(text)
          return
        }

        iteration += 1
        frameId = setTimeout(tick, speed)
      }
      
      tick()
    }

    if (delay > 0) {
      timeoutId = setTimeout(scramble, delay)
    } else {
      scramble()
    }

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      clearTimeout(frameId)
    }
  }, [text, speed, delay])

  return (
    <span style={style} className={className}>
      {displayText}
    </span>
  )
}
