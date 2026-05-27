import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const USERS = {
  student: {
    id: 'G6401231013',
    name: 'Quina Rizky Dae Yuena Siregar',
    initials: 'QR',
    role: 'student',
    email: 'quina.siregar@apps.ipb.ac.id',
    faculty: 'FMIPA',
    department: 'Ilmu Komputer',
    year: 2023,
    color: '#3B6D11',
  },
  staff: {
    id: 'STAFF-2024-008',
    name: 'Ghanianda Wafiqarifah',
    initials: 'GW',
    role: 'staff',
    email: 'ghanianda@ipb.ac.id',
    unit: 'Direktorat Akademik',
    department: 'Pelayanan Mahasiswa',
    color: '#2478C8',
  },
  admin: {
    id: 'ADMIN-001',
    name: 'Winanci Zahrawaini Setiawan',
    initials: 'WZ',
    role: 'admin',
    email: 'winanci@ipb.ac.id',
    unit: 'Direktorat TIK IPB',
    color: '#BA7517',
  },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (mockToken, role, email) => {
    setUser(USERS[role] || USERS.student)
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}