import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import DashboardLayout from "./components/DashboardLayout"
import DashboardOverview from "./dashboard/DashboardOverview"
import Upload from "./dashboard/Upload"
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login"
function App() {
  return (
    <>

      <Toaster position="bottom-right" reverseOrder={true} />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login"element={<Login/>}/>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="upload" element={<Upload />} />
        </Route>


      </Routes>
    </>
  )
}
export default App
