import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, DollarSign, Users, Gavel, Info, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';
import { apiService, Auction } from '../lib/api';

interface AuctionCardProps {
  auction: Auction;
  onBidPlaced?: () => void; // Callback to refresh auction data
}

export const AuctionCard = ({ auction, onBidPlaced }: AuctionCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { formatAmount, getSymbol, convertAmount, currency } = useCurrency();
  
  const [bidAmount, setBidAmount] = useState(() => {
    const currentBid = convertAmount(auction.currentBid || auction.startingPrice || 0, 'USD');
    return currentBid + (currency === 'INR' ? 850 : 10); // Add 10 USD equivalent
  });
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  const endDate =
    auction.endTime instanceof Date ? auction.endTime : new Date(auction.endTime);
  const timeLeft = endDate.getTime() - new Date().getTime();
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const handlePlaceBid = async () => {
    const currentBidInDisplayCurrency = convertAmount(auction.currentBid || auction.startingPrice || 0, 'USD');
    
    if (bidAmount <= currentBidInDisplayCurrency) {
      toast({
        title: "Invalid bid",
        description: "Your bid must be higher than the current bid.",
        variant: "destructive",
      });
      return;
    }

    setIsPlacingBid(true);

    try {
      // Convert bid amount back to USD for backend
      const bidInUSD = currency === 'INR' ? Math.round(bidAmount / 85) : bidAmount;
      const result = await apiService.placeBid(auction.id, bidInUSD);
      // Call the callback to refresh auction data
      if (onBidPlaced) {
        onBidPlaced();
      }
      toast({
        title: "Bid placed",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handlePayment = () => {
    navigate('/payment', { 
      state: { 
        auction, 
        winningBid: auction.currentBid || auction.startingPrice 
      } 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'ended': return 'bg-muted text-muted-foreground';
      case 'upcoming': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 group">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={auction.imageUrl || '/placeholder.svg'}
            alt={auction.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-4 left-4">
            <Badge className={getStatusColor(auction.status)}>
              {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge variant="secondary" className="bg-background/80 text-foreground">
              {auction.category}
            </Badge>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-background/80 hover:bg-background/90">
                  <Info className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{auction.title}</h4>
                  <p className="text-sm text-muted-foreground">{auction.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Starting Bid:</span>
                      <div className="font-semibold text-foreground">
                        {getSymbol()}{formatAmount(auction.startingPrice || 0)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current Bid:</span>
                      <div className="font-semibold text-primary">
                        {getSymbol()}{formatAmount((auction.currentBid || auction.startingPrice) || 0)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2 font-medium text-foreground">{auction.category}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-foreground">{auction.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{auction.description}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Current Bid</span>
            </div>
            <span className="text-2xl font-bold text-primary">
              {getSymbol()}{formatAmount((auction.currentBid || auction.startingPrice) || 0)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{auction.bidCount} bids</span>
            </div>
            {auction.status === 'active' && timeLeft > 0 && (
              <div className="flex items-center space-x-2 text-accent">
                <Clock className="h-4 w-4" />
                <span>
                  {days > 0 ? `${days}d ` : ''}
                  {hours > 0 ? `${hours}h ` : ''}
                  {minutes}m left
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {auction.status === 'active' && timeLeft > 0 && (
        <CardFooter className="p-6 pt-0">
          <div className="w-full space-y-3">
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  min={convertAmount((auction.currentBid || auction.startingPrice || 0), 'USD') + (currency === 'INR' ? 85 : 1)}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter bid amount"
                />
              </div>
              <Button
                onClick={handlePlaceBid}
                disabled={isPlacingBid}
                className="bg-gradient-primary hover:opacity-90 transition-smooth"
              >
                <Gavel className="h-4 w-4 mr-2" />
                {isPlacingBid ? 'Bidding...' : 'Bid'}
              </Button>
            </div>
          </div>
        </CardFooter>
      )}

      {(auction.status === 'ended' || timeLeft <= 0) && (
        <CardFooter className="p-6 pt-0">
          <div className="w-full text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Auction ended • Winner: You (Demo)
            </p>
            <Button
              onClick={handlePayment}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Complete Payment
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
