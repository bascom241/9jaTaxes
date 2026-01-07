
const Navbar = () => {
    return (
        <nav className="bg-white w-full shadow-md py-0  md:py-2 border-b-gray-600 fixed top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                {/* Logo */}
                <div className="text-xl font-bold text-green-800">
                    Tax Wise
                </div>

                {/* Links (desktop) */}
                <div className="hidden md:flex space-x-6">
                    <a href="/" className="text-gray-700 hover:text-green-800">Home</a>
                    <a href="/learn" className="text-gray-700 hover:text-green-800">Learn</a>
                    <a href="/news" className="text-gray-700 hover:text-green-800">News</a>
                </div>


                <div className="hidden md:flex space-x-6">
                    <button className="flex items-center justify-center p-3 rounded-4xl bg-green-800">
                        <a href="/login" className="text-white ">Sign In </a>
                    </button>
                </div>

                {/* Mobile placeholder */}
                <div className="md:hidden">
                    <button className="text-gray-700 focus:outline-none">
                        Menu
                    </button>
                </div>
            </div>
        </nav>

    )
}

export default Navbar
