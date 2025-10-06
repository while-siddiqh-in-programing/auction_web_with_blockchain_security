package com.example.demo.services;

import com.example.demo.model.Auction;
import org.springframework.stereotype.Service;

@Service
public class BlockchainService {

    public long createAuctionOnChain(long auctionId, long startingPrice, long duration) {
        // TODO: integrate with web3j smart contract
        System.out.println("Creating auction on blockchain...");
        return auctionId > 0 ? auctionId : System.currentTimeMillis(); // mock on-chain ID
    }

    public void placeBidOnChain(long auctionId, long bidAmount) {
        System.out.println("Placing bid on auction " + auctionId + " with " + bidAmount + " wei");
    }

    public void endAuctionOnChain(long auctionId) {
        System.out.println("Ending auction on blockchain: " + auctionId);
    }
}
