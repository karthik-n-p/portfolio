import { useEffect, useRef, useState } from 'react'
import { colors } from '../design-tokens.js'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const [isHidden, setIsHidden] = useState(false)
  
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const trailing = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const isHovering = useRef(false)
  const targetRect = useRef(null)

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsHidden(true)
      return
    }

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      let pt = e.target
      let interactable = false
      while (pt && pt !== document.body) {
        const tag = pt.tagName?.toLowerCase()
        if (
          tag === 'button' || 
          tag === 'a' || 
          pt.onclick != null ||
          pt.classList?.contains('nav-btn') ||
          window.getComputedStyle(pt).cursor === 'pointer'
        ) {
          interactable = true;
          // Capture the exact geometry of the button to snap onto
          targetRect.current = pt.getBoundingClientRect()
          break;
        }
        pt = pt.parentElement
      }
      isHovering.current = interactable
      if (!interactable) targetRect.current = null
    }

    const onMouseLeave = () => setIsHidden(true)
    const onMouseEnter = () => setIsHidden(false)

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    let animId
    const animate = () => {
      if (cursorRef.current && dotRef.current) {
        // Dot is exactly on mouse
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`

        if (isHovering.current && targetRect.current) {
          // Magnetic Snap: Lerp the trailing cursor towards the exact center of the hovered element
          const { left, top, width, height } = targetRect.current
          const targetX = left + width / 2
          const targetY = top + height / 2
          
          trailing.current.x += (targetX - trailing.current.x) * 0.3
          trailing.current.y += (targetY - trailing.current.y) * 0.3
          
          cursorRef.current.style.transform = `translate3d(${trailing.current.x}px, ${trailing.current.y}px, 0) translate(-50%, -50%)`
          cursorRef.current.style.width = `${width + 12}px`
          cursorRef.current.style.height = `${height + 12}px`
          cursorRef.current.style.borderRadius = '8px'
          cursorRef.current.style.background = 'rgba(0, 85, 255, 0.1)' // Azure tint
          cursorRef.current.style.borderColor = 'rgba(0, 85, 255, 0.6)'
          
          dotRef.current.style.opacity = 0 // hide center dot while snapped
        } else {
          // Normal Trailing Circle
          trailing.current.x += (mouse.current.x - trailing.current.x) * 0.25
          trailing.current.y += (mouse.current.y - trailing.current.y) * 0.25
          
          cursorRef.current.style.transform = `translate3d(${trailing.current.x}px, ${trailing.current.y}px, 0) translate(-50%, -50%)`
          cursorRef.current.style.width = '28px'
          cursorRef.current.style.height = '28px'
          cursorRef.current.style.borderRadius = '50%'
          cursorRef.current.style.background = 'transparent'
          cursorRef.current.style.borderColor = 'rgba(226, 232, 240, 0.4)' // Titanium border
          
          dotRef.current.style.opacity = 1
        }
      }
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      cancelAnimationFrame(animId)
    }
  }, [])

  if (isHidden) return null

  return (
    <>
      <div 
        ref={cursorRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          pointerEvents: 'none', zIndex: 99999,
          border: '1px solid transparent',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s, border-color 0.2s, border-radius 0.2s'
        }} 
      />
      <div 
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '5px', height: '5px',
          borderRadius: '50%', background: colors.neutral[100],
          pointerEvents: 'none', zIndex: 100000,
          transition: 'opacity 0.2s',
          boxShadow: `0 0 10px ${colors.neutral[100]}`
        }} 
      />
    </>
  )
}
