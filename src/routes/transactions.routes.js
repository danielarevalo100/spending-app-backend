const express = require('express');
const router = express.Router();
const Transaction = require("../models/transaction");
const User = require("../models/user");

router.get('/:id', async (req,res)=>{
    
    const transaction = await Transaction.find({userId:req.params.id}).sort({date:-1})
    console.log(req.params)
    res.status(200).json(transaction)
})
router.post('/',async (req,res)=>{
    const {data:{id,email,amount,type}}=req.body
    console.log(req.body)
    if(id && email && amount && type){
        const user = await User.findById(id)
        if(user){
            if(user.balance > amount){
                const transaction = new Transaction({userId: id,amount,email,type})
                await transaction.save()
                const newBalance = user.balance - amount;
                if(type == 'SEND'){
                    user.balance = newBalance;
                    await User.findOneAndUpdate({_id:user._id},{balance: newBalance})
                    res.status(200).json({newBalance})
                }
            }else res.status(201).json({message:'not enough founds'})
        }else{
            res.status(202).json({message:'No user found'})
        }



    }else{
        res.status(400).json({transaction:'wrong parameters'})
    }

})

module.exports = router;