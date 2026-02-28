import { signOut } from "firebase/auth"
import { auth } from "../firebase/config"
import { useNavigate } from "react-router-dom"
export default function DashboardLayout({ children }) {
    const navigate = useNavigate()

const handleLogout = async () => {
  await signOut(auth)
  navigate("/")
}
  return (
    <div className="flex min-h-screen">

      <div className="w-72 backdrop-blur-xl 
                      bg-white/5 border-r border-white/10 p-6">


        <h2 className="text-2xl font-bold 
                       bg-linear-to-r from-blue-400 to-purple-500 
                       bg-clip-text text-transparent">
          MediNova
        </h2>
        <button
  onClick={handleLogout}
  className="mt-10 w-full py-2 rounded-lg
             bg-red-500/20 hover:bg-red-500/40 transition">
  Logout
</button>

      </div>

      <div className="flex-1 p-8">
        {children}
      </div>

    </div>
  )
}