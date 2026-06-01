import { redirect }  from 'next/navigation'
import { isAdmin }   from '@/lib/admin-auth'
import AdminShell    from '@/components/admin/AdminShell'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  if (!(await isAdmin())) redirect('/admin')
  return <AdminShell />
}
