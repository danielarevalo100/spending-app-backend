const express = require('express');
const router = express.Router();
const User = require("../models/user");
const jwt = require('jsonwebtoken')


router.get('/', async (req, res) => {
    const users = await User.find();

    // console.log(tasks)
    // res.json(tasks)
    res.json(users)
});    

// router.post('/login',async (req,res) =>{
    
//     const {password} = req.body
//     const user = await User.findOne({password})
//     if(user){
//         const token = jwt.sign({id: user._id},'Daniel',{
//             expiresIn: 3600
//         })
//         res.status(200).json({ status: "ok", message:"logged in successful ", data: {user: user,token: token}})
        
//     }else{
//         res.status(204).json({status: 204, message: "no users found with this password"})
//     }
//     // res.json({status: 'todo esta bien'})
// })
router.post('/login',checkheadertoken,async (req,res) =>{
    const token=null
    if("tokenData" in req){
        const user = await User.findById(req.tokenData.id)
        
        res.status(200).json({data:{user}})
    }else{

        if(req.body.password){

            const {password} = req.body
            
            const user = await User.findOne({password})
            
            if(user){
                const token = jwt.sign({id:user._id},'Daniel',{
                    expiresIn: 3600
                })
                res.status(200).json({ status: "ok", message:"logged in successful ", data: {user: user,token: token}})
            }else{
                res.status(403).json({status: 403, message: "no users found with this password"})
            }
        }
        res.status(400).json({status:400,message:'Wrong parameters'})
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
    
    // if(auth){
    //     console.log("I am here")
    //     jwt.verify(auth,'Daniel', async (err,data) => {
    //         if(err){
    //             console.log("error")
    //             res.status(204)
    //         }else{
    //             // console.log(data)
    //             const user = await User.findOne({_id: data.id}, 'userName')
    //             let response ={
    //                 userName: user.userName,
    //                 id: user._id
    //             }
    //             // console.log(user)
    //             res.status(200).json({
    //               text: 'protected',
    //               data: response
    //             })
    //         }
    //     })
    // }
}

router.post('/', async (req,res) => {
    const {userName,password}=req.body
    
    if(!userName || !password){
        res.status(403).json({
            status:"wrong Parameters"
        }) 
        return
    }
    
    const user = new User({userName,password});
    await user.save()

    res.status(200).json({
        userName,password
    })


})

// router.put('/:id' , async (req,res) => {
//     const {title, description} = req.body;
//     const newTask = {title,description};
//     await Task.findByIdAndUpdate(req.params.id, newTask);
//     console.log(req.params.id)
//     res.json({status: 'Task Updated'})
// })

// router.delete('/:id', async (req,res) => {
//     const id = req.params.id;
//     await Task.findByIdAndDelete(id)
//     res.json({status: 'Task Deleted'})
// })
router.get('/:id', async (req,res) => {
   const user = await User.findById(req.params.id)
    res.json(user)
    
    
})
module.exports = router;



