import { useCallback, useEffect, useState } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function useAppliedJobIds() {
  const { isCandidate } = useAuth()
  const [ids, setIds] = useState(() => new Set())

  const refresh = useCallback(async () => {
    if (!isCandidate) return setIds(new Set())
    try {
      const { data } = await api.get('/applications/me/job-ids')
      setIds(new Set(data.jobIds.map(String)))
    } catch {
      setIds(new Set())
    }
  }, [isCandidate])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { appliedIds: ids, refreshApplied: refresh }
}
