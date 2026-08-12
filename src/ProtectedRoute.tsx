import { Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Temporary: Auth is bypassed so you can access /dashboard directly
  return <Outlet />;
}
