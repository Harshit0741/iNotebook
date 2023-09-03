const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'hgisgod$bouy'

// Route:1 Create a User using: POST "/api/auth/createuser". 
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('password', 'Password must be atleast 5 character').isLength({min: 5}),
    body('email', 'Enter a valid email').isEmail()
] , async (req, res)=>{
  let success = false;
  // If there are errors, retutrn Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  //Check weather the user with same email exist
  try {
  
  let user = await User.findOne({email: req.body.email});
  if (user){
    return res.status(400).json({success, error: 'Please enter a unique key' })
  }
const salt = await bcrypt.genSalt(10)
  secPass = await bcrypt.hash(req.body.password, salt)
  // Create a new user
  user = await User.create({
    name: req.body.name,
    password: secPass,
    email: req.body.email,
  })
  const data = {
    user:{
      id: user.id
    }
  }
    const authtoken = jwt.sign(data, JWT_SECRET);
    
    // res.json(user)
    success = true;
    res.json({success ,authtoken})

  } catch (error) {
    console.error(error.message)
    res.status(500).send("Some error occured")
  }
  });



  //Route:2 Create a User using: POST "/api/auth/login". 
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be empty').exists()
] , async (req, res)=>{
  let success = false;
  // If there are errors, retutrn Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.status(400).json({errors: errors.array()});
}
  const {email, password} = req.body;
  try {
    let user = await User.findOne({email});
    if(!user){
      success = false;
      return res.status(400).json({error: "User does not exist"});
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
      success = false;
      return res.status(400).json({success ,error: "User does not exist"});
    }
    const data = {
      user:{
        id: user.id
      }
    }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success ,authtoken})
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Some error occured")
  }
})


 //Route:3 Get logged in user details: POST "/api/auth/getuser". login Required 
 router.post('/getuser', fetchuser, async (req, res)=>{

 try {
  userId= req.user.id
  const user = await User.findById(userId)
  res.send(user)
 } catch (error) {
  console.error(error.message)
    res.status(500).send("Some error occured")
 }
})
module.exports = router