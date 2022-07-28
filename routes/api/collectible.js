let mongoose = require('mongoose');
let express = require('express');
const multer = require('multer');
let router = express.Router();
const fs = require("fs");
const Web3 = require("web3");
let CollectibleSchema = require('../../models/collectible');
const Axios  = require('axios');

var web3 = new Web3();
var tokenAddress = "0xe56F12123c583De823720A603b2DC11D659C12fC";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
}

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
            file_path: req.body.file
        });
        await collectibleInfo.save();  
        res.json({"Success":"OK"})
    }catch(err){
        console.log(err)
        res.json({"Success":"NO"})
    }
})

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