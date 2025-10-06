package com.example.demo.controllers;

import com.example.demo.model.Auction;
import com.example.demo.services.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin(origins = "*") // Allow all origins for development
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    // ✅ Create a new auction
    @PostMapping
    public Auction createAuction(@RequestBody Auction auction) throws Exception {
        return auctionService.createAuction(auction);
    }

    // ✅ Get all auctions
    @GetMapping
    public List<Auction> listAuctions() {
        return auctionService.listAuctions();
    }

    // ✅ Get a specific auction by MongoDB ID
    @GetMapping("/{id}")
    public Auction getAuction(@PathVariable String id) {
        return auctionService.getAuction(id);
    }

    // ✅ Place a bid
    @PostMapping("/{id}/bid")
    public String placeBid(@PathVariable String id, @RequestParam long bidAmount) throws Exception {
        auctionService.placeBid(id, bidAmount);
        return "Bid of " + bidAmount + " placed on auction " + id;
    }

    // ✅ End an auction
    @PostMapping("/{id}/end")
    public String endAuction(@PathVariable String id) throws Exception {
        auctionService.endAuction(id);
        return "Auction " + id + " ended.";
    }
}
