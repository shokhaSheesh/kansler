import { Navigate } from 'react-router'
import { paths } from '@/app/router/paths'

/** Live mobile map page. In the redesign the map is part of the address window. */
export default function MapPage() {
  return <Navigate to={`${paths.profile.address}?new=1`} replace />
}
