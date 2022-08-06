let mongoose = require('mongoose');
let express = require('express');
const multer = require('multer');
let router = express.Router();
const fs = require("fs");
const Web3 = require("web3");
let CollectibleSchema = require('../../models/collectible');
const User = require("../../models/User");
const Axios  = require('axios');

var web3 = new Web3();
var tokenAddress = "0xe56F12123c583De823720A603b2DC11D659C12fC";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
}

// @route POST api/collectible/create-nft
// @desc Login user and create NFT
// @access Public

router.post('/create-nft', multer({ dest: 'uploads' }).any(),async (req, res) => {
    try{
        const collectibleInfo = new CollectibleSchema({
            wallet: req.body.wallet,
            name: req.body.name,
            externalLink: req.body.externalLink,
            description: req.body.description,
            collectionName: req.body.collection,
            properties: req.body.properties,
            levels: req.body.levels,
            stats: req.body.stats,
            category: req.body.category,
            unlockContent: req.body.unlockContent,
            sensitiveContent: req.body.sensitiveContent,
            supply: req.body.supply,
            chain: req.body.chain,
            freeze: req.body.freeze,
            smartcontractAddress: req.body.smartcontractAddress,
            tokenId: req.body.tokenId,
            file_path: req.body.file,
            make: 1
        });
        await collectibleInfo.save();  
        res.json({"Success":"OK"})
    }catch(err){
        console.log(err)
        res.json({"Success":"NO"})
    }
})

// @route POST api/collectible/buy
// @desc Login user and Buy the NFT
// @access Public

router.route('/buy').post((req,res, next) =>{   
    CollectibleSchema.findOne({_id: req.body.id}, (error,data)=>{
        if(error){
            return next(error)
        }
        else{
            data.wallet = req.body.wallet;
            data.price = req.body.price;
            data.auctionDate = new Date();
            data.bidder = {}
            data.make = 0;
            data.save();
            res.json(data);
        }
    })
})

// @route POST api/collectible/make-offer
// @desc Login user and Make offer(bidding)
// @access Public
router.route('/make-offer').post(async(req,res, next) =>{
    const user = await User.findOne({wallet: req.body.wallet});
    const collection = await CollectibleSchema.findOne({_id: req.body.id});
     
    let temp = {};
    if (collection.bidder) {
        try{
            temp = JSON.parse(collection.bidder);
        }catch(err){}
    }
    if(temp&&temp[req.body.wallet]) delete(temp[req.body.wallet])
    else{ 
        temp[req.body.wallet] = []; 
        temp[req.body.wallet].push(user.wallet);
        temp[req.body.wallet].push(user.file_path); 
        temp[req.body.wallet].push(new Date()); 
        temp[req.body.wallet].push(user.name);
        temp[req.body.wallet].push(req.body.price)
    }
    collection.bidder = JSON.stringify(temp)
    collection.save();
    res.json(collection);
    
})

// @route POST api/collectible/cancel-offer
// @desc Login user and Cancel offer(bidding)
// @access Public
router.route('/cancel-offer').post(async(req,res, next) =>{
    const user = await User.findOne({wallet: req.body.wallet});
    const collection = await CollectibleSchema.findOne({_id: req.body.id});
     
    let temp = {};
    if (collection.bidder) {
        temp = JSON.parse(collection.bidder);
    }
    if(temp&&temp[req.body.wallet]) delete(temp[req.body.wallet])
    collection.bidder = JSON.stringify(temp)
    collection.save();
    res.json(collection);
    
})

// @route POST api/collectible/accept-offer
// @desc Login user and Accept offer(bidding)
// @access Public
router.route('/accept-offer').post(async(req,res, next) =>{
    const user = await User.findOne({wallet: req.body.wallet});
    const collection = await CollectibleSchema.findOne({_id: req.body.id});

    collection.make = 0;
    collection.bidder = {}
    collection.auctionDate = new Date();
    collection.wallet = req.body.wallet;

    collection.save();
    res.json(collection);
    
})

// @route POST api/collectible/change-to-sell
// @desc Login user and Sell the NFT
// @access Public

router.route('/change-to-sell').post((req,res, next) =>{
    CollectibleSchema.findOne({_id: req.body.id}, (error,data)=>{
        if(error){
            return next(error)
        }
        else{
            try{
                data.auctionDate = new Date(req.body.date);
                data.price = req.body.price;
                data.onSale = true;
                data.save();
                res.json(data);
            }catch(err){
                console.log(err)
            }
        }
    })
})

// @route POST api/collectible/change-to-cancelsell
// @desc Login user and Cancel  the Selling NFT
// @access Public

router.route('/change-to-cancelsell').post((req,res, next) =>{
    CollectibleSchema.findOne({_id: req.body.id}, (error, data)=>{
        if(error){
            return next(error)
        }
        else{
            try{
                data.onSale = false;
                data.save();
                res.json(data);
            }catch(err){
                console.log(err)
            }
        }
    })
})

// @route POST api/collectible/get-all-collectibles
// @desc Login user and return all infos of NFTs
// @access Public

router.route('/get-all-collectibles').post((req,res, next) =>{
    CollectibleSchema.find((error,data)=>{
        if(error){
            return next(error)
        }
        else{
            res.json(data);
        }
    })
})

// @route POST api/collectible/create-nft
// @desc Login user and return follow or unfollw
// @access Public

router.route('/set-collectible-on-sale').post((req,res)=>{
    console.log(req.body)
    CollectibleSchema.findOneAndUpdate({tokenID: req.body.tokenId},{onSale:true }, (error,data)=>{
        if(error){
            console.log(error)
        } 
        else{
            res.json(data)
        }
    })
})

// @route POST api/collectible/create-nft
// @desc Login user and return follow or unfollw
// @access Public

router.route('/get-one-collectible').post((req,res)=>{
    console.log(req.body)
    CollectibleSchema.findOne({tokenID: req.body.tokenId}, (error,data)=>{
        if(error){
            console.log(error)
        }
        else{
            res.json(data)
        }
    })
})

// @route POST api/collectible/create-nft
// @desc Login user and return follow or unfollw
// @access Public

router.route('/get-my-item-collectibles').post((req,res)=>{
    console.log(req.body.myPubKey);
    var lowPubKey = req.body.myPubKey.toLowerCase();
    CollectibleSchema.find({ownerPubKey: lowPubKey, onSale: false},(error,data)=>{
        if(error){
            console.log(error)
        }
        else{
            res.json(data)
            console.log("wowo")
        }
    })
})

// @route POST api/collectible/create-nft
// @desc Login user and return follow or unfollw
// @access Public

router.route('/buy-collectible').post((req,res)=>{
    
    CollectibleSchema.findOneAndUpdate({tokenID: req.body.tokenId},{ownerPubKey:req.body.owner, onSale: false }, (error,data)=>{
        if(error){
            console.log(error)
        }
        else{
            res.json(data)
            console.log("great")
        }
    })
})

module.exports = router;