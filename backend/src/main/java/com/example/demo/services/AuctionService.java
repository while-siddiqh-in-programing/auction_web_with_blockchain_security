package com.example.demo.services;

import com.example.demo.model.Auction;
import com.example.demo.repositories.AuctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuctionService {

    @Autowired
    private AuctionRepository auctionRepo;

    @Autowired
    private BlockchainService blockchainService;

    public Auction createAuction(Auction auction) throws Exception {
        long onChainId = blockchainService.createAuctionOnChain(
                auction.getAuctionId(),
                auction.getStartingPrice(),
                auction.getDuration()
        );
        auction.setAuctionId(onChainId);
        // Initialize new fields
        auction.setCurrentBid(auction.getStartingPrice());
        auction.setBidCount(0);
        auction.setStatus("active");
        auction.setCreatedAt(System.currentTimeMillis());
        if (auction.getCategory() == null) {
            auction.setCategory("Other");
        }
        return auctionRepo.save(auction);
    }

    public List<Auction> listAuctions() {
        List<Auction> auctions = auctionRepo.findAll();
        // Update status based on current time
        for (Auction auction : auctions) {
            updateAuctionStatus(auction);
        }
        return auctions;
    }

    private void updateAuctionStatus(Auction auction) {
        if ("active".equals(auction.getStatus())) {
            // Check if auction time has passed
            long currentTime = System.currentTimeMillis();
            long auctionEndTime = auction.getCreatedAt() + (auction.getDuration() * 1000); // Convert seconds to milliseconds
            
            if (currentTime > auctionEndTime) {
                auction.setStatus("ended");
                auctionRepo.save(auction);
            }
        }
    }

    public Auction getAuction(String id) {
        return auctionRepo.findById(id).orElse(null);
    }

    public void placeBid(String auctionId, long bidAmount) throws Exception {
        Auction auction = getAuction(auctionId);
        if (auction != null) {
            blockchainService.placeBidOnChain(auction.getAuctionId(), bidAmount);
            // Update auction with new bid
            auction.setCurrentBid(bidAmount);
            auction.setBidCount(auction.getBidCount() + 1);
            auctionRepo.save(auction);
        }
    }

    public void endAuction(String auctionId) throws Exception {
        Auction auction = getAuction(auctionId);
        if (auction != null) {
            blockchainService.endAuctionOnChain(auction.getAuctionId());
            auction.setStatus("ended");
            auctionRepo.save(auction);
        }
    }
}
