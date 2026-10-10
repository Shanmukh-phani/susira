import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

const STYLES = {
  success: { icon: CheckCircle2, className: 'border-green-200 bg-green-50 text-green-800' },
  error: { icon: XCircle, className: 'border-red-200 bg-red-50 text-red-800' },
  info: { icon: Info, className: 'border-brand-200 bg-brand-50 text-brand-800' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  const push = useCallback(
    (type, message, title) => {
      const id = `${Date.now()}-${Math.random()}`
      setToasts((list) => [...list.slice(-3), { id, type, message, title }])
      setTimeout(() => dismiss(id), 5000)
    },
    [dismiss]
  )

  const toast = useMemo(
    () => ({
      success: (msg, title) => push('success', msg, title),
      error: (msg, title) => push('error', msg, title),
      info: (msg, title) => push('info', msg, title),
    }),
    [push]
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-3 bottom-3 z-[100] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-5 sm:bottom-5">
        {toasts.map((t) => {
          const { icon: Icon, className } = STYLES[t.type] || STYLES.info
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-3 shadow-lg sm:w-96 ${className}`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1 text-sm">
                {t.title && <p className="font-semibold">{t.title}</p>}
                <p className="break-words">{t.message}</p>
              </div>
              <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext)
