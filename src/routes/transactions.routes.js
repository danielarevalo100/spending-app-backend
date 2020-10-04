const express = require('express');
const router = express.Router();
const Transaction = require("../models/transaction");
const User = require("../models/user");
const jwt = require('jsonwebtoken')

router.get('/:id', async (req,res)=>{
    
    const transaction = await Transaction.find({userId:req.params.id}).sort({date:-1})
    console.log(req.params)
    res.status(200).json(transaction)
})
router.post('/',checkheadertoken,async (req,res)=>{
    if(!req.tokenData) res.status(202).json({message:'No user found'})
    
    const {data:{email,amount,type}}=req.body;
    const {id}= req.tokenData
    
    if(id && email && amount && type){
        const user = await User.findById(id)
        if(user){
            if(type == 'SEND'){
                if(user.balance > amount){
                    const transaction = new Transaction({userId: id,amount,email,type})
                    await transaction.save()
                    const newBalance = user.balance - amount;
                    user.balance = newBalance;
                    await User.findOneAndUpdate({_id:id},{balance: newBalance})
                    res.status(200).json({newBalance})
                    
                }else res.status(201).json({message:'not enough founds'})
            }else if(type=='REQUEST'){
                if(req.body.data.name){
                    const name = req.body.data.name;
                    const transaction = new Transaction({userId: id,amount,email,type,name});
                    await transaction.save()
                    res.status(200).json({message:'Transaction created'})

                }
            }
        }else{
            res.status(202).json({message:'No user found'})
        }



    }else{
        res.status(400).json({transaction:'wrong parameters'})
    }

})
function checkheadertoken(req,res,next){
    const auth = req.headers.authorization;
    // console.log(auth)

    if(auth){
        jwt.verify(auth,'Daniel',(err,data)=>{
            if(err){
                next()
            }else{
                req.tokenData=data
                
                next()
            }
        })
    }else{
        next()
    }
}
module.exports = router;