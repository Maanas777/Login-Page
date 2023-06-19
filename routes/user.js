const {response}=require('express')
const express=require('express')
const userhelpers=require('../helpers/user_helpers')
const adminhelper=require('../helpers/admin_helpers')
const router=express.Router()



router.get('/',(req,res)=>{
    
    if (req.session.loggedIn) {
        res.redirect('/home');
    } else {
        res.render('login',{emailErr:req.session.emailErr,passErr:req.session.passErr})
    } 
})

router.post('/login',(req,res)=>{
    // console.log(req.body);
    req.session.emailErr = null;
    req.session.passErr = null

    userhelpers.doLogin(req.body)
    .then((response)=>{
        if(response.status=='Invalid User'){
            req.session.emailErr=response.status
            res.redirect('/')
          
        }
        else if(response.status=='Invalid Password'){
             req.session.passErr=response.status
             res.redirect('/')
            
        }
        else{
            req.session.loggedIn=true
            res.redirect('/home')
           
        }
    })

 
})

const checkLogged=(req,res,next)=>{
    if(req.session.loggedIn){
        next()
    }
    else{
        res.redirect('/')
    }
}


router.get('/home',checkLogged,(req,res)=>{
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.render('home')
})
router.get('/homeLogout', (req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

router.get('/signup',(req,res)=>{
    res.render('signup')
})

router.post('/signup',(req,res)=>{
    adminhelper.addUser(req.body).then(()=>{
        req.session.emailErr = null
        req.session.passErr = null; 
        res.redirect('/'); 
    }).catch((err)=>{
        res.status(400).send({ error: err.message });
    })
})


module.exports=router


