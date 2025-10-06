package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "auctions")
public class Auction {
    @Id
    private String id;
    private String title;
    private String description;
    private String imageUrl;
    private long auctionId;       // On-chain ID
    private String sellerAddress;
    private long startingPrice;   // In wei
    private long duration;        // In seconds
    private String category;      // Auction category
    private long currentBid;      // Current highest bid
    private int bidCount;         // Number of bids placed
    private String status;        // active, ended, pending
    private long createdAt;       // Creation timestamp in milliseconds

    // Getters and Setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public long getAuctionId() {
        return auctionId;
    }
    public void setAuctionId(long auctionId) {
        this.auctionId = auctionId;
    }

    public String getSellerAddress() {
        return sellerAddress;
    }
    public void setSellerAddress(String sellerAddress) {
        this.sellerAddress = sellerAddress;
    }

    public long getStartingPrice() {
        return startingPrice;
    }
    public void setStartingPrice(long startingPrice) {
        this.startingPrice = startingPrice;
    }

    public long getDuration() {
        return duration;
    }
    public void setDuration(long duration) {
        this.duration = duration;
    }

    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }

    public long getCurrentBid() {
        return currentBid;
    }
    public void setCurrentBid(long currentBid) {
        this.currentBid = currentBid;
    }

    public int getBidCount() {
        return bidCount;
    }
    public void setBidCount(int bidCount) {
        this.bidCount = bidCount;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    
    public long getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }
}
