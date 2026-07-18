import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

const spring = { type: 'spring', stiffness: 260, damping: 24, mass: 0.6 }

export function AmbientBackground() {
  const reduce = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 90, damping: 28 })
  const smoothY = useSpring(mouseY, { stiffness: 90, damping: 28 })
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  const onMouseMove = (event) => {
    mouseX.set(event.clientX)
    mouseY.set(event.clientY)
  }

  return (
    <div className="ambient-stage" onMouseMove={onMouseMove} aria-hidden="true">
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <motion.div className="cursor-spotlight" style={{ x: smoothX, y: smoothY }} />
      <div className="aurora-field" />
      <motion.div
        className="orb orb-one"
        animate={reduce ? false : { x: [0, 34, -22, 0], y: [0, -28, 18, 0], rotate: [0, 12, -8, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb orb-two"
        animate={reduce ? false : { x: [0, -42, 18, 0], y: [0, 26, -20, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb orb-three"
        animate={reduce ? false : { x: [0, 22, -18, 0], y: [0, 20, -24, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="grain-layer" />
    </div>
  )
}

export function PageMotion({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 18, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(10px)' }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  )
}

export function Reveal({ children, className = '', delay = 0, y = 28 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(14px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SplitText({ text, className = '' }) {
  return (
    <motion.span className={className} aria-label={text}>
      {text.split(' ').map((word, wordIndex) => (
        <span className="inline-block whitespace-pre" aria-hidden="true" key={`${word}-${wordIndex}`}>
          {word.split('').map((char, charIndex) => (
            <motion.span
              className="inline-block"
              key={`${char}-${charIndex}`}
              initial={{ opacity: 0, y: 18, rotateX: -70, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              transition={{ ...spring, delay: 0.018 * (wordIndex * 7 + charIndex) }}
            >
              {char}
            </motion.span>
          ))}
          <span>{' '}</span>
        </span>
      ))}
    </motion.span>
  )
}

export function MagneticButton({ children, className = '', as: Component = 'button', ...props }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 18 })
  const springY = useSpring(y, { stiffness: 300, damping: 18 })

  const onMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18)
    y.set((event.clientY - rect.top - rect.height / 2) * 0.28)
  }

  return (
    <motion.div style={{ x: springX, y: springY }} onMouseMove={onMouseMove} onMouseLeave={() => { x.set(0); y.set(0) }}>
      <Component className={`premium-action ${className}`} {...props}>
        <span className="premium-action__shine" />
        <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
      </Component>
    </motion.div>
  )
}

export function TiltCard({ children, className = '', depth = 12 }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-0.5, 0.5], [depth, -depth])
  const rotateY = useTransform(x, [-0.5, 0.5], [-depth, depth])
  const highlightX = useTransform(x, [-0.5, 0.5], ['15%', '85%'])
  const highlightY = useTransform(y, [-0.5, 0.5], ['15%', '85%'])

  const onMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left) / rect.width - 0.5)
    y.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div
      className={`tilt-shell ${className}`}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileHover={{ y: -10, scale: 1.015 }}
      transition={spring}
    >
      <motion.span className="tilt-highlight" style={{ left: highlightX, top: highlightY }} />
      {children}
    </motion.div>
  )
}

export function FloatingBadge({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={`floating-badge ${className}`}
      animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}
