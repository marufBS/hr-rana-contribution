const express = require('express');
const imageUrl = require('../models/imageModel');
const router = express.Router();
// const bcrypt = require('bcrypt');

const multer = require('multer');
const user = require('../models/user.model');
require("dotenv").config();
const Cloudinary = require('cloudinary').v2;






// console.log("the api kyes",process.env.CLOUD_NAME, process.env.CLOUD_APIKYE, process.env.CLOUD_API_SECRET)











// getting all qr data from database

router.get("/allImages", async (req, res)=>{
    
    try {
        const images = await imageUrl.find();
        res.status(200).json(images)
    } catch (error) {
        res.status(500).json(error);
    }
    
       
    
})
 



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
  
const upload = multer({ storage: storage });




router.post("/uploadImages", upload.single("image"), async (req, res)=>{
    const reqData = req.file.filename;
    const filePath =req.file.path;
    const QRCode = `https://api.qrserver.com/v1/create-qr-code/?data=${filePath}`
    // const title = req.body;
 


    try {
        if(reqData){
            // var ResultURl = await Cloudinary.uploader.upload(QRCode, (err, res)=>{
            //     if (err) {
            //         console.log(err)
            //         return res.status(500).json(err.message)
            //     }
            //     console.log("image uploaded successfully")
            //     console.log("the iamge url", ResultURl.url)
            // });
            const saveData = await imageUrl.create({
                imgName: reqData,
                // imgUrl: ResultURl.url,
                imgUrl:QRCode,
            })
            res.status(200).json(saveData);
        }
      
    } catch (error) {
        res.status(500).json(error.message);
    }
    

});


router.post("/deleteImage/:id", async (req, res)=>{
    const id = req.params.id;
    try {
        await imageUrl.deleteOne({_id:id});
        res.status(200).json({
            status:"Success",
            message:"Image deleted successfully"
        })

        console.log(id, "image deleted successfully")

    } catch (error) {
        res.status(500).send(error);
    }

});


router.post("/singup", async (req, res) => {
    const number = req.body.number;
    const password = req.body.password;

    if (!number || !password) {
        return res.status(400).json({message:"Please enter name and number"});
    }

    try {   
        
        const saveData = await user.create({
            number: req.body.number,
            password: req.body.password
        })
        await saveData.save();
        res.status(201).json(saveData);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
})



router.post("/login_user", async (req, res) => { 
    const password = req.body.password;
    const numb = req.body.number;
    

  

    if (!password ||!numb) {
        return res.status(400).json({message:"Please enter name and number"});
    }

    try {

      const getUser =  await user.findOne({number:numb, password:password});
      if (!getUser) {
        return res.status(401).json({
            message: "Invalid username or password",
            status:404
        });
      }
      res.status(200).json(getUser);

        
    } catch (error) {
        res.status(400).json({
            message: error.message, 
            status: error.status
        });
    }

})













module.exports = router;