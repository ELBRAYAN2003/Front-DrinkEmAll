import { useEffect, useReducer } from 'react'

// Cuenta regresiva a un instante fijo. Recibe un timestamp (ms) para que el
// contador no se reinicie en cada render ni dependa del momento del montaje.

const pad = (n) => String(n).padStart(2, '0')

function remaining(target) {
  const diff = Math.max(0, target - Date.now())
  const total = Math.floor(diff / 1000)
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  }
}

export default function Countdown({ target, compact = false }) {
  // El intervalo solo fuerza un re-render por segundo; el tiempo restante se
  // deriva durante el render, de modo que siempre refleja el `target` vigente
  // sin necesidad de sincronizar estado dentro del efecto.
  const [, tick] = useReducer((n) => n + 1, 0)

  useEffect(() => {
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const left = remaining(target)
  const units = [
    { value: left.d, label: 'd' },
    { value: left.h, label: 'h' },
    { value: left.m, label: 'm' },
    { value: left.s, label: 's' },
  ]

  return (
    <div className={`countdown ${compact ? 'is-compact' : ''}`.trim()} role="timer">
      {units.map(({ value, label }, i) => (
        <span key={label} className="countdown-unit">
          <b>{pad(value)}</b>
          <i>{label}</i>
          {i < units.length - 1 && <s aria-hidden="true">:</s>}
        </span>
      ))}
    </div>
  )
}
