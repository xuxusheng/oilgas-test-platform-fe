import { Outlet } from 'react-router-dom'
import { Button } from 'antd'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Admin Platform</h1>
        <Button type="primary">Login</Button>
      </header>
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}

export default App
