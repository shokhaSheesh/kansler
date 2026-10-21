import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authStore } from '@/stores/auth.store'
import { notificationApi } from './api'

export const useNotifications = () =>
  useQuery({
    queryKey: ['KANSLER_NOTIFICATION_LIST'],
    queryFn: () => notificationApi.list(),
    enabled: authStore.isAuthorized,
  })

export const useNotificationCount = () =>
  useQuery({ queryKey: ['NOTIFICATION_COUNT'], queryFn: notificationApi.count, enabled: authStore.isAuthorized })

export const useMarkNotificationRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.markRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['KANSLER_NOTIFICATION_LIST'] })
      qc.invalidateQueries({ queryKey: ['NOTIFICATION_COUNT'] })
    },
  })
}
