import { useEffect, useRef } from 'react'

// Vidrio que se raja bajo el puntero.
//
// Cada impacto abre grietas radiales en angulos IRREGULARES (si fueran
// equidistantes se leeria como copo de nieve) y despues cuerdas que unen
// grietas vecinas: esas cuerdas son las que forman las esquirlas y las que
// hacen que el ojo lo interprete como vidrio roto y no como una estrella.
//
// Va en canvas porque el efecto es acumulativo: cada impacto queda pintado.
// El canvas no se repinta entero, se dibuja encima y cada frame se le resta
// alfa, asi las grietas se cierran solas cuando el mouse se va.

// Distancia que hay que recorrer antes de abrir un impacto nuevo. Sin este
// umbral el header se destruiria entero con el primer movimiento.
const STEP_BETWEEN_HITS = 70

export default function GlassCracks({ hostRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let raf = 0
    let cracked = false
    let prev = null
    let travelled = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = host.getBoundingClientRect()
      w = Math.round(rect.width)
      h = Math.round(rect.height)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    // Una grieta: avanza a pasos con leve desvio de rumbo. El desvio la
    // mantiene recta pero no perfecta, que es como se parte el vidrio.
    const runCrack = (x, y, angle, length) => {
      let cx = x
      let cy = y
      let a = angle
      let travelledCrack = 0
      let waist = null

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      while (travelledCrack < length) {
        const step = 5 + Math.random() * 9
        a += (Math.random() - 0.5) * 0.4
        cx += Math.cos(a) * step
        cy += Math.sin(a) * step
        travelledCrack += step
        ctx.lineTo(cx, cy)
        if (!waist && travelledCrack >= length * 0.5) waist = { x: cx, y: cy }
      }
      ctx.stroke()

      return { waist: waist ?? { x: cx, y: cy }, tip: { x: cx, y: cy }, angle: a }
    }

    const impact = (x, y) => {
      const arms = 5 + Math.floor(Math.random() * 5)

      // Angulos desparejos a proposito.
      const angles = []
      let a = Math.random() * Math.PI * 2
      for (let i = 0; i < arms; i++) {
        a += ((Math.PI * 2) / arms) * (0.5 + Math.random())
        angles.push(a)
      }

      const waists = []
      const tips = []

      ctx.strokeStyle = 'rgba(255,255,255,0.55)'
      ctx.lineWidth = 0.9
      for (const angle of angles) {
        const seg = runCrack(x, y, angle, 16 + Math.random() * 60)
        waists.push(seg.waist)
        tips.push(seg.tip)

        // Bifurcacion ocasional en angulo cerrado.
        if (Math.random() < 0.3) {
          ctx.strokeStyle = 'rgba(255,255,255,0.34)'
          ctx.lineWidth = 0.7
          runCrack(
            seg.waist.x,
            seg.waist.y,
            seg.angle + (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.6),
            10 + Math.random() * 26,
          )
          ctx.strokeStyle = 'rgba(255,255,255,0.55)'
          ctx.lineWidth = 0.9
        }
      }

      // Cuerdas entre grietas vecinas: cierran los poligonos de esquirla.
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 0.7
      for (let i = 0; i < arms; i++) {
        const j = (i + 1) % arms
        if (Math.random() < 0.75) {
          ctx.beginPath()
          ctx.moveTo(waists[i].x, waists[i].y)
          ctx.lineTo(waists[j].x, waists[j].y)
          ctx.stroke()
        }
        if (Math.random() < 0.4) {
          ctx.beginPath()
          ctx.moveTo(tips[i].x, tips[i].y)
          ctx.lineTo(tips[j].x, tips[j].y)
          ctx.stroke()
        }
      }

      // Chispazo en el punto de impacto.
      const g = ctx.createRadialGradient(x, y, 0, x, y, 9)
      g.addColorStop(0, 'rgba(255,255,255,0.5)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, 9, 0, Math.PI * 2)
      ctx.fill()
    }

    const onMove = (event) => {
      const rect = host.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      host.style.setProperty('--fx', `${x}px`)
      host.style.setProperty('--fy', `${y}px`)
      cracked = true

      if (prev) {
        travelled += Math.hypot(x - prev.x, y - prev.y)
        // Un impacto cada tanto recorrido, no uno por evento.
        while (travelled >= STEP_BETWEEN_HITS) {
          travelled -= STEP_BETWEEN_HITS
          impact(x, y)
        }
      } else {
        impact(x, y)
      }
      prev = { x, y }
    }

    const onEnter = () => {
      cracked = true
      host.classList.add('is-chilled')
    }

    const onLeave = () => {
      cracked = false
      prev = null
      travelled = 0
      host.classList.remove('is-chilled')
    }

    const tick = () => {
      // Con el mouse encima las grietas casi no se borran; al salir, el
      // vidrio se "repara" rapido.
      const fade = cracked ? 0.004 : 0.03
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = `rgba(0,0,0,${fade})`
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerenter', onEnter)
    host.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerenter', onEnter)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [hostRef])

  return <canvas ref={canvasRef} className="header-cracks" aria-hidden="true" />
}
