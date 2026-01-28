
import Box from '../../ui/Box'
import { Users, FileText } from 'lucide-react' // Install lucide-react for icons

const DashboardOverview = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Box
          title="Total Users"
          value="1,234"
          icon={<Users className="w-8 h-8" />}
        />
        
        <Box
          title="Articles Uploaded"
          value="567"
          icon={<FileText className="w-8 h-8" />}
        />
        
        {/* Add more boxes as needed */}
        <Box
          title="Pending Reviews"
          value="89"
          icon={<FileText className="w-8 h-8" />}
        />
      </div>
      
      <div className="mt-8">
        <p className="text-gray-700">This is the Dashboard Home Page</p>
      </div>
    </div>
  )
}

export default DashboardOverview