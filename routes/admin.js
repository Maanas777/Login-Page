const express=require('express')
const router=express.Router()
const adminHelper=require('../helpers/admin_helpers')

//admin Details--
const adminId='admin@gmail.com'
const adminPass='admin123'

//message
const message='Incorrect entry !!!'

router.get('/adminLogin',(req,res)=>{
    if(req.session.loggedIn){
        res.redirect('/admin')
    }else{
    res.render('adminLogin')
    }
})

router.post('/admlogin',(req,res)=>{
    console.log(req.body);
    var username =req.body.username
    var password =req.body.password
    if (username===adminId && password===adminPass) {
        req.session.loggedIn=true
        res.redirect('/admin')
    }else{
        res.render('adminLogin', {message})
    }
})


router.get('/admin', async(req,res)=>{
    if(req.session.loggedIn){
        const userData=await adminHelper.getUser()
        res.render('admin',{ userData })
    }else{
        res.redirect('/adminLogin')
    }
})
router.post('/admin-User-add',(req,res)=>{
    if(req.session.loggedIn){
         adminHelper.addUser(req.body)
         .then(()=>{
            res.redirect('back')
         }).catch((err)=>{
            console.log(err);
         })
    }else{
        res.redirect('/admin_login')
    }
})
router.post('/edituser/:id',(req,res)=>{
    if(req.session.loggedIn){
        const userId=req.params.id
        adminHelper.editUser(userId,req.body)
        .then(()=>{
            res.redirect('back')
        })
        .catch(()=>{
            res.redirect('back')
        })
    }else{
        res.redirect('/admin_login')
    }
})
router.post('/searchUser',(req,res)=>{
    if(req.session.loggedIn){
        adminHelper.searchUser(req.body.name)
        .then((userData)=>{
            res.render('admin',{ userData })
        })
        .catch((err)=>{
            res.render('admin',{err})
        })
    }else{
        res.redirect('/admin_login')
    }
})
router.get('/deleteUser/:id',(req,res)=>{
    if(req.session.loggedIn){
        const userId=req.params.id
        adminHelper.deleteUser(userId)
        .then(()=>{
            res.redirect('back')
        })
        .catch(()=>{
            res.redirect('back')
        })
    }else{
        res.redirect('/admin_login')
    }
})

// Logout 
router.get('/adminlogout', (req, res) => {
    req.session.loggedIn=false
    req.session.destroy();
    res.redirect('/adminLogin');
});
 
module.exports=router 