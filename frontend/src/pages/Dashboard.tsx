import { useState, useEffect } from 'react';
import { AuctionCard } from '@/components/AuctionCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { apiService, Auction } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshAuctions = async () => {
    try {
      const data = await apiService.getAuctions();
      setAuctions(data || []);
    } catch (error) {
      console.error('Failed to refresh auctions:', error);
    }
  };

  const categories = ['all', 'Art', 'Watches', 'Collectibles', 'Antiques', 'Jewelry'];

  // Load auctions from API
  useEffect(() => {
    const loadAuctions = async () => {
      try {
        setLoading(true);
        console.log('Loading auctions...');
        const data = await apiService.getAuctions();
        console.log('Received data:', data);
        setAuctions(data || []);
      } catch (error) {
        console.error('Failed to load auctions:', error);
        toast({
          title: "Failed to load auctions",
          description: "Unable to fetch auctions from the server. Please try again later.",
          variant: "destructive",
        });
        // Set empty array on error to prevent crashes
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    loadAuctions();
  }, [toast]);

  const filteredAuctions = auctions.filter(auction => {
    if (!auction || !auction.title || !auction.description) return false;
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || auction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    switch (sortBy) {
      case 'ending-soon':
        return (a.endTime?.getTime() || 0) - (b.endTime?.getTime() || 0);
      case 'highest-bid':
        return (b.currentBid || 0) - (a.currentBid || 0);
      case 'most-bids':
        return (b.bidCount || 0) - (a.bidCount || 0);
      default:
        return 0;
    }
  });

  const handleBid = async (auctionId: string, amount: number) => {
    try {
      await apiService.placeBid(auctionId, amount);
      // Refresh auctions to get updated data
      const updatedAuctions = await apiService.getAuctions();
      setAuctions(updatedAuctions);
      toast({
        title: "Bid placed successfully",
        description: `Your bid of $${amount} has been placed.`,
      });
    } catch (error) {
      console.error('Failed to place bid:', error);
      toast({
        title: "Failed to place bid",
        description: "Unable to place your bid. Please try again.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Live Blockchain Auctions
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Secure, transparent bidding powered by blockchain technology
        </p>
      </div>


      {/* Filters */}
      <div className="bg-gradient-card border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-secondary border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-secondary border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="ending-soon">Ending Soon</option>
              <option value="highest-bid">Highest Bid</option>
              <option value="most-bids">Most Bids</option>
            </select>
          </div>
        </div>
      </div>

      {/* Auctions Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">Loading auctions...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedAuctions.map(auction => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              onBidPlaced={refreshAuctions}
            />
          ))}
        </div>
      )}

      {sortedAuctions.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">
            {auctions.length === 0 
              ? "No auctions available at the moment. Create one to get started!" 
              : "No auctions found matching your criteria"
            }
          </div>
          {auctions.length > 0 && (
            <Button className="mt-4" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;