import { observer } from 'mobx-react-lite'
import { Navigate, Outlet, useLocation } from 'react-router'
import { env } from '@/shared/config/env'
import { authStore } from '@/stores/auth.store'
import { paths } from './paths'

export const RequireAuth = observer(() => {
  const location = useLocation()
  if (!authStore.isAuthorized && !env.designMode) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`${paths.auth.login}?redirect=${redirect}`} replace />
  }
  return <Outlet />
})
