import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/CurrencyContext';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatAmount, getSymbol, convertAmount } = useCurrency();
  
  // Get auction data from navigation state
  const auction = location.state?.auction;
  const winningBidUSD = location.state?.winningBid || auction?.currentBid;
  const winningBid = convertAmount(winningBidUSD || 0, 'USD'); // Convert to display currency

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setPaymentComplete(true);
      setIsProcessing(false);
      toast({
        title: "Payment Successful!",
        description: "Your payment has been processed successfully. The item will be shipped to you shortly.",
      });
    }, 3000);
  };

  if (!auction) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Required</h1>
        <p className="text-muted-foreground mb-4">No auction data found.</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card border-border shadow-elegant">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            <CardDescription>
              Thank you for your purchase. Your payment has been processed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-secondary rounded-lg p-4">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Item:</span>
                <span>{auction.title}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Winning Bid:</span>
                <span className="font-bold text-primary">{getSymbol()}{formatAmount(winningBid)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Processing Fee:</span>
                <span>{getSymbol()}{formatAmount(Math.round(winningBid * 0.05))}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>{getSymbol()}{formatAmount(winningBid * 1.05)}</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                You will receive a confirmation email with tracking details within 24 hours.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/')}>
                  Back to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/transactions')}>
                  View Transactions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
        <p className="text-muted-foreground">
          Congratulations! You won the auction. Complete your payment to secure your item.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Auction Summary */}
        <Card className="bg-gradient-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {auction.imageUrl ? (
                <img 
                  src={auction.imageUrl} 
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-lg">{auction.title}</h3>
              <p className="text-muted-foreground text-sm">{auction.description}</p>
              <Badge variant="secondary" className="mt-2">{auction.category}</Badge>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Winning Bid:</span>
                <span className="font-bold text-primary">{getSymbol()}{formatAmount(winningBid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee (5%):</span>
                <span>{getSymbol()}{formatAmount(Math.round(winningBid * 0.05))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{getSymbol()}{formatAmount(winningBid * 1.05)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card className="bg-gradient-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Details</span>
            </CardTitle>
            <CardDescription>
              Your payment information is secure and encrypted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={paymentData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  required
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  required
                  className="bg-secondary border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    required
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    required
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Input
                  id="billingAddress"
                  placeholder="123 Main St"
                  value={paymentData.billingAddress}
                  onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                  required
                  className="bg-secondary border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Mumbai"
                    value={paymentData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="400001"
                    value={paymentData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    required
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing Payment...' : `Pay ${getSymbol()}${formatAmount(winningBid * 1.05)}`}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <Shield className="h-4 w-4 inline mr-1" />
                Secured by 256-bit SSL encryption
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;