import { 
  MessageSquare, 
  Shield, 
  FileText, 
  HelpCircle, 
  Globe, 
  Users,
  Award,
  TrendingUp,
  Lock,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
  Instagram
} from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#213448] text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                {/* Top Section: Logo and Description */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-12">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <MessageSquare className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">TaxBot AI</h2>
                                <p className="text-emerald-300 text-lg">Intelligent Tax Assistant</p>
                            </div>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                            Revolutionizing tax compliance and financial understanding in Nigeria through 
                            artificial intelligence. We provide accurate, up-to-date tax guidance 24/7.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-emerald-300">Quick Links</h3>
                        <ul className="space-y-3">
                            {['About Us', 'Features', 'Pricing', 'Documentation', 'API Access', 'Partners'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-300 hover:text-emerald-300 hover:underline transition-colors flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-emerald-300">Contact Us</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-300">
                                <Mail className="w-5 h-5 text-emerald-400" />
                                <span>support@taxbot.ng</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <Phone className="w-5 h-5 text-emerald-400" />
                                <span>+234 800 TAX BOT</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <MapPin className="w-5 h-5 text-emerald-400" />
                                <span>Lagos, Nigeria</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-b border-gray-700">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <Award className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-2">Certified Accurate</h4>
                            <p className="text-gray-400">Verified by Nigerian tax authorities</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <Lock className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-2">Bank-Level Security</h4>
                            <p className="text-gray-400">256-bit encryption for all your data</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-2">10,000+ Users</h4>
                            <p className="text-gray-400">Trusted by businesses nationwide</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Social and Legal */}
                <div className="pt-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Social Media */}
                        <div className="flex items-center gap-6">
                            <span className="text-gray-400">Follow us:</span>
                            <div className="flex gap-4">
                                {[
                                    { icon: Twitter, label: 'Twitter' },
                                    { icon: Linkedin, label: 'LinkedIn' },
                                    { icon: Facebook, label: 'Facebook' },
                                    { icon: Instagram, label: 'Instagram' }
                                ].map((social) => (
                                    <a 
                                        key={social.label}
                                        href="#" 
                                        className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Legal Links */}
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Terms of Service
                            </a>
                            <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors flex items-center gap-2">
                                <HelpCircle className="w-4 h-4" />
                                Cookie Policy
                            </a>
                            <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Compliance
                            </a>
                        </div>
                    </div>

                    {/* Copyright and Stats */}
                    <div className="mt-8 pt-8 border-t border-gray-700">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-center md:text-left">
                                <p className="text-gray-400">
                                    © {currentYear} TaxBot AI Assistant. All rights reserved.
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    FIRS Registered • NITDA Compliant • ISO 27001 Certified
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span>System Status: Operational</span>
                                </div>
                                <span>•</span>
                                <span>Version: 3.2.1</span>
                                <span>•</span>
                                <span>Uptime: 99.9%</span>
                                <span>•</span>
                                <span>Users: 10,247</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-black/30 py-4">
                <div className="max-w-7xl mx-auto px-8">
                    <p className="text-center text-gray-400 text-sm">
                        ⚠️ Disclaimer: TaxBot provides AI-powered guidance. For official tax matters, 
                        please consult certified tax professionals. Information is updated regularly 
                        but may not reflect the most recent regulatory changes.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;