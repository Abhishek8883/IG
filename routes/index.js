var express = require('express');
var router = express.Router();
var userModel = require('./users')
var postModel = require('./post')
var storyModel = require('./story')
var commentModel = require('./comment')
const passport = require('passport');
const localStrategy = require("passport-local")
const plm = require('passport-local-mongoose')
const sendmail = require('./mail')
var Jimp = require('jimp')
const multer  = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,file.originalname )
  }
})

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/story')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,file.originalname )
  }
})

const upload = multer({ storage: storage })
const upload1 = multer({ storage: storage1 })


passport.use(new localStrategy(userModel.authenticate()));





/* ----------------  index page. ----------------- */
router.get('/', function(req, res, next) {
  res.render('index');
});



// ---------------- route for rendering register page ----------
router.get('/signup', function(req, res, next) {
  res.render('register');
});


//  ----------- user registration route  -- - --
router.post('/register',function(req,res){
  var newuser = new userModel({
    name:req.body.name,
    email:req.body.email,
    username:req.body.username,
    profilePic:"default.png"
  })
  userModel.register(newuser,req.body.password)
  .then(function(registereduser){
    passport.authenticate('local')(req,res,
      function(){
        res.redirect('/homepage')
      })
  })
  .catch(function(err){
    res.send(err)
  })
})






//--------- homepage page route ------------
router.get('/homepage',isLoggedIn,function(req,res,next){
 userModel.findOne({username:req.session.passport.user})
 .then(function(founduser){
  postModel.find()
  .populate('author')
  .then(function(allPost){
    storyModel.find().populate('author')
    .then(function(allStory){
      res.render('homepage',{allPost,founduser,allStory})
    })
  })
 })
})





// ----route to manage likes of post ----
router.get('/likes/:id',function(req,res,next){
  userModel.findOne({username:req.session.passport.user})
  .then(function(founduser){
    postModel.findOne({_id:req.params.id})
    .then(function(foundpost){
      var userindex = foundpost.likes.indexOf(founduser._id)
      if(userindex === -1){
        foundpost.likes.push(founduser._id)
      }
      else{
        foundpost.likes.splice(userindex,1)
      }
      foundpost.save()
      .then(function(){
        res.redirect('/homepage')
      })
    })
    })
  })




// ---route to show create post page -----
router.get('/getCreatePostPage',isLoggedIn,function(req,res,next){
  res.render('createPost')
})



// ----route to create a post -- --  -- 
router.post('/createPost', upload.single('avatar'), function (req, res, next) {
  if(req.file){
  userModel.findOne({username:req.session.passport.user})
  .then(function(foundUser){
    postModel.create({
      content:req.body.content,
      author:foundUser._id
    })
    .then(function(createdPost){
      createdPost.image.push(req.file.filename)
      Jimp.read(`./public/upload/${req.file.filename}`, (err, val) => {
        if (err) throw err;
        else{
          if(val.bitmap.width>500){
              val
                .resize(val.bitmap.width*0.5, val.bitmap.height*0.5) 
                .quality(60) 
                .write(`./public/upload/${req.file.filename}`); 
              }
        }
      });
      createdPost.save()
      .then(function(data){
       foundUser.posts.push(data)
       foundUser.save()
       .then(function(){
         res.redirect('/homepage')
       })
      })
    })
  })
}
else{
  userModel.findOne({username:req.session.passport.user})
  .then(function(founduser){
    postModel.create({
      content:req.body.content,
      author:founduser._id
    })
    .then(function(createdPost){
      founduser.posts.push(createdPost)
      founduser.save()
      .then(function(data){
        res.redirect('/homepage')
      })
    })
  })
}
})






// ---route to create story
router.post('/createStory', upload1.single('image'), function (req, res, next) {
  if(req.file){
  userModel.findOne({username:req.session.passport.user})
  .then(function(foundUser){
    storyModel.create({
      content:req.body.content,
      author:foundUser._id
    })
    .then(function(createdStory){
      createdStory.image.push(req.file.filename)
      Jimp.read(`./public/images/story/${req.file.filename}`, (err, val) => {
        if (err) throw err;
        else{
          if(val.bitmap.width>500){
              val
                .resize(val.bitmap.width*0.5, val.bitmap.height*0.5) 
                .quality(60) 
                .write(`./public/images/story/${req.file.filename}`); 
              }
        }
      });
      createdStory.save()
      .then(function(data){
       foundUser.story.push(data)
       foundUser.save()
       .then(function(){
         res.redirect('/homepage')
       })
      })
    })
  })
}
else{
  userModel.findOne({username:req.session.passport.user})
  .then(function(founduser){
    storyModel.create({
      content:req.body.content,
      author:founduser._id
    })
    .then(function(createdStory){
      founduser.story.push(createdStory)
      founduser.save()
      .then(function(data){
        res.redirect('/homepage')
      })
    })
  })
}
})



// route to render comment page----
router.get('/getCommentpage/:id',isLoggedIn,function(req,res,next){
     postModel.findOne({_id:req.params.id})
     .populate('comments')
     .then(function(post){    
        res.render('comments',{post})
     })
   }) 




// ----route to create comment --- 
router.post('/createComment/:_id',function(req,res,next){
  userModel.findOne({username:req.session.passport.user})
  .then(function(founduser){
    postModel.findOne({_id:req.params._id})
  .then(function(foundpost){
    commentModel.create({
      comment:req.body.content,
      })
      .then(function(createdComment){
        foundpost.comments.push(createdComment)
        foundpost.save()
        .then(function(){
          res.redirect('/getcommentpage/'+req.params._id)
        })
      })
    })
  })
})




// ---route to render story page
router.get('/createStoryPage',function(req,res,next){
    res.render('createStory')
})




//  --- route to send data 
router.get('/getdata',function(req,res,next){
  storyModel.find()
  .populate('author')
  .then(function(allStory){
    res.json({allStory})
  })
})



// ------ route for search functionality in homepage navigation ---
router.get('/navSearch/:value',function(req,res,next){
    var regex = new RegExp('^'+ req.params.value)
    userModel.find({username:regex})
    .then(function(matchedUsers){
      res.json({matchedUsers})
    })
})



// --- follow functionality -- 
router.get('/follow/:value',function(req,res,next){
  userModel.findOne({username:req.params.value})
  .then(function(founduser){ 
    res.send(founduser)
  })
})





// ---- route to render forgot password page --- 
router.get('/forgetPassword',function(req,res,next){
    res.render('reset')
  })



// -----route to check existing user and send the reset password email
router.get('/forget',function(req,res,next){
  sendmail().then(function(data){
    console.log(data)
  })
  res.redirect('/')
  // userModel.findOne({email:req.body.email})
  // .then(function(foundUser){
  //   if(foundUser == false){
  //     res.send("User not exist")
  //   }
  //   else{
  //     var emailText = "anything"
  //     sendmail(req.body.email,emailText)
  //     res.redirect("/")
       
  //   }
  // })
})




// -----profile route ------
router.get('/profile',function(req,res,next){
  userModel.findOne({username:req.session.passport.user})
  .populate('posts')
  .then(function(founduser){
    res.render('profile',{allPost:founduser})
  })
})


// -----------   login route -----------
router.post('/login',passport.authenticate("local",{
  successRedirect:"/homepage",
  failureRedirect:"/"
}),function(req,res,next){});




//  ------------------ function to check whether user is logged in ---------
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/")
}



// ------------------logout route -----------
router.get('/logout' , function(req, res){
  req.logout();
  res.redirect('/');
});


module.exports = router;
