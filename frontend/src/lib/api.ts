// API service for connecting to the backend auction system
// The backend was changed to run on port 8081 in `application.properties`.
// Keep this simple for development; consider using Vite env vars (VITE_API_URL) later.
const API_BASE_URL = 'http://localhost:8081/api';

export interface Auction {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  auctionId: number;
  sellerAddress: string;
  startingPrice: number;
  duration: number;
  // Additional fields for frontend display
  category?: string;
  currentBid?: number;
  bidCount?: number;
  status?: 'active' | 'ended' | 'pending';
  endTime?: Date;
}

export interface CreateAuctionRequest {
  title: string;
  description: string;
  imageUrl?: string;
  startingPrice: number;
  duration: number;
  category?: string;
}

export interface BidRequest {
  bidAmount: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  walletAddress?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Try JSON first, fallback to text
      const text = await response.text();
      try {
        return JSON.parse(text) as T;
      } catch {
        return { message: text } as unknown as T;
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auction endpoints
  async getAuctions(): Promise<Auction[]> {
    try {
      const auctions = await this.request<any[]>('/auctions');
      console.log('Raw API response:', auctions);

      // Transform backend data to frontend format
      return auctions.map(auction => {
        const transformedAuction: Auction = {
          id: auction.id || '',
          title: auction.title || 'Untitled Auction',
          description: auction.description || 'No description',
          imageUrl: auction.imageUrl || '',
          auctionId: auction.auctionId || 0,
          sellerAddress: auction.sellerAddress || '',
          startingPrice: auction.startingPrice || 0,
          duration: auction.duration || 0,
          currentBid: auction.currentBid || auction.startingPrice || 0,
          bidCount: auction.bidCount || 0,
          status: auction.status || 'active',
          endTime: auction.endTime
            ? new Date(auction.endTime)
            : new Date(Date.now() + (auction.duration || 0) * 1000),
          category: auction.category || 'Other',
        };
        console.log('Transformed auction:', transformedAuction);
        return transformedAuction;
      });
    } catch (error) {
      console.error('Error in getAuctions:', error);
      throw error;
    }
  }

  async getAuction(id: string): Promise<Auction> {
    const auction = await this.request<Auction>(`/auctions/${id}`);
    return {
      ...auction,
      currentBid: auction.startingPrice,
      bidCount: 0,
      status: 'active' as const,
      endTime: new Date(Date.now() + auction.duration * 1000),
      category: auction.category || 'Other',
    };
  }

  async createAuction(auctionData: CreateAuctionRequest): Promise<Auction> {
    const auction = await this.request<Auction>('/auctions', {
      method: 'POST',
      body: JSON.stringify({
        title: auctionData.title,
        description: auctionData.description,
        imageUrl: auctionData.imageUrl,
        startingPrice: auctionData.startingPrice,
        duration: auctionData.duration * 24 * 60 * 60, // Convert days to seconds
        sellerAddress: '0x0000000000000000000000000000000000000000', // Placeholder
        auctionId: 0, // Will be set by backend
        category: auctionData.category || 'Other',
      }),
    });

    return {
      ...auction,
      currentBid: auction.startingPrice,
      bidCount: 0,
      status: 'active' as const,
      endTime: new Date(Date.now() + auction.duration * 1000),
      category: auctionData.category || 'Other',
    };
  }

  async placeBid(auctionId: string, bidAmount: number): Promise<{ message: string }> {
    return await this.request<{ message: string }>(
      `/auctions/${auctionId}/bid?bidAmount=${bidAmount}`,
      { method: 'POST' }
    );
  }

  async endAuction(auctionId: string): Promise<{ message: string }> {
    return await this.request<{ message: string }>(
      `/auctions/${auctionId}/end`,
      { method: 'POST' }
    );
  }

  // User authentication endpoints
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    return await this.request<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    return await this.request<AuthResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  }

  async getUser(id: string): Promise<User> {
    return await this.request<User>(`/users/${id}`);
  }
}

export const apiService = new ApiService();
