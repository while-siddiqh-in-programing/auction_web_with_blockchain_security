package com.example.demo.repositories;

import com.example.demo.model.Auction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuctionRepository extends MongoRepository<Auction, String> {
}
