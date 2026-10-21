import { Navigate } from 'react-router'
import { paths } from '@/app/router/paths'

/** Live mobile review form page. In the redesign the form is a window on the reviews page. */
export default function Redirect() {
  return <Navigate to={paths.profile.comments} replace />
}
