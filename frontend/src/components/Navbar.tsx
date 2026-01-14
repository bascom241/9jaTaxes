import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, getUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      await getUser();
      setLoading(false);
    };
    fetchUser();
  }, [getUser]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const menuLinks = [
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "News", href: "/news" },
  ];

  return (
    <nav className="bg-white w-full shadow-md border-b border-gray-200 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-xl font-bold text-green-800">Tax Wise</div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {menuLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-green-800 transition"
            >
              {link.name}
            </a>
          ))}

          {!loading && !user && (
            <a
              href="/login"
              className="px-6 py-2 bg-green-800 text-white font-semibold rounded-full hover:bg-green-700 transition"
            >
              Sign In
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition"
          >
            {mobileMenuOpen ? (
              <X size={20} className="text-green-800" />
            ) : (
              <Menu size={20} className="text-green-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="flex flex-col px-4 py-4 space-y-4">
            {menuLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-green-800 font-medium transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

            {!loading && !user && (
              <a
                href="/login"
                className="px-6 py-2 bg-green-800 text-white font-semibold rounded-full hover:bg-green-700 transition text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
