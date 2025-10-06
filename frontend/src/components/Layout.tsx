import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Gavel, Plus, Activity, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/CurrencyContext';
import logo from '@/assets/logo.png';


interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currency, setCurrency } = useCurrency();
  
  // Get user from localStorage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const user = isAuthenticated ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "You have been securely logged out.",
    });
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Gavel },
    { name: 'Create Auction', href: '/create', icon: Plus },
    { name: 'Transactions', href: '/transactions', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-gradient-card shadow-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img src={logo} alt="BlockAuction Logo" className="h-8 w-8" />
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  BlockAuction
                </span>
              </Link>
              
              {isAuthenticated && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-smooth ${
                          location.pathname === item.href
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Currency Selector */}
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'USD' | 'INR')}
                  className="bg-secondary border border-border rounded px-2 py-1 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              {isAuthenticated ? (
                <>
                  <div className="hidden sm:flex sm:flex-col sm:text-right">
                    <span className="text-sm font-medium text-foreground">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};