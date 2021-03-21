const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Transactions = require("../models/transaction");
const jwt = require('jsonwebtoken')
const tools = require('../utils/tools/index')

router.get('/transactions', checkheadertoken, async (req, res) => {
  if( 'tokenData' in req ){
    console.log('token', req.tokenData)

    const user = await User.findById(req.tokenData.id,{password:0,_id:0})

    const parsedUser = {...user.toJSON()};
    console.log(parsedUser.type)
    if(parsedUser?.type == 1){
      const transactions = await Transactions.aggregate([
      { $match: {status: 'PENDING'} },
      { $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
        }
      }
    ])
      const response = transactions.filter( trans => trans.user.length ).map( trans => ({...trans, user: tools.cleanData(trans.user[0], ['_id','password','type']) } ));
      console.log( 'user', response )
      res.status(200).json(response)
    }else{
      res.status(201).json('not_authorized')
    }
  }else{
    res.status(400).json('message')
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
