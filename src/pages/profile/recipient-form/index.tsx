import { Navigate } from 'react-router'
import { paths } from '@/app/router/paths'

/** Live mobile form page. In the redesign the form is a window on the list page (all screen sizes). */
export default function Redirect() {
  return <Navigate to={`${paths.profile.recipient}?new=1`} replace />
}
