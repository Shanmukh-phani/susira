import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '../lib/api'
import { useAuth } from './AuthContext'

const SocketContext = createContext({ socket: null, connected: false })

export function SocketProvider({ children }) {
  const { token } = useAuth()
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const instance = io(SOCKET_URL, {
      auth: token ? { token } : {},
      transports: ['websocket', 'polling'],
      reconnectionDelay: 2000,
    })
    instance.on('connect', () => setConnected(true))
    instance.on('disconnect', () => setConnected(false))
    setSocket(instance)
    return () => {
      instance.disconnect()
      setConnected(false)
    }
  }, [token])

  return <SocketContext.Provider value={{ socket, connected }}>{children}</SocketContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext)

/** Subscribe to a socket event for the lifetime of the component. */
// eslint-disable-next-line react-refresh/only-export-components
export function useSocketEvent(event, handler) {
  const { socket } = useSocket()
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    if (!socket) return
    const listener = (data) => handlerRef.current(data)
    socket.on(event, listener)
    return () => socket.off(event, listener)
  }, [socket, event])
}
