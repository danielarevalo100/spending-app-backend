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
      },
      { $sort: {date: -1} },
      { $limit: 10 }
    ])
      const response = transactions.filter( trans => trans.user.length ).map( trans => ({...trans, user: tools.cleanData(trans.user[0], ['_id','password','type']) } ));
      res.status(200).json(response)
    }else{
      res.status(201).json('not_authorized')
    }
  }else{
    res.status(400).json('message')
  }
})

router.post( '/transactions/changeStatus', checkheadertoken, async (req, res) => {
  //if( !('tokenData' in req) ) res.status(400);

  const { body: { id, status } } = req;
  try{

    const trans = await Transactions.findById(id);

    if( Object.keys(trans).length > 0 ){
      const { amount, userId, type } = trans;

      switch(status){
        case 'DONE':

            if(type === 'SEND'){

              await Transactions.updateOne(
                { _id: id },
                { '$set': { status: 'DONE' } }
              );

            } else if(type === 'REQUEST'){

               await Transactions.updateOne(
                { _id: id },
                { 
                  '$set': { status: 'DONE' },
                }
              );

              //updating user
              await User.updateOne(
                { _id: userId },
                {'$inc': { balance: amount }}
              );
            }
        break;

        case 'CANCELLED':

            if(type === 'REQUEST'){
              await Transactions.updateOne(
                { _id: id},
                { $set: { status: 'CANCELLED' } }
              )
            } else if(type === 'SEND'){
              await Transactions.updateOne(
                { _id: id },
                { 
                  $set: { status: 'CANCELLED' },
                }
              );
              await User.updateOne(
                { _id: userId },
                {$inc: { balance: amount }}
              );
            }
          break;
          default: res.status(201);
      }
    }
    res.status(200).json({ok: true})
  }catch( e ){
    res.status(500)
    console.log('error', e)
  }

});

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
