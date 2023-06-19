const db=require('../config/connection')
const bcrypt=require('bcrypt');
const collection=require('../config/collection');
const { reject } = require('bcrypt/promises');

module.exports={

    doLogin: (userData)=>{
        return new Promise(async(resolve,reject)=>{
            const response={}
            const user=await db.get().collection(collection.ADMIN_COLLECTION)
            .findOne({email: userData.email}) 

            if(user){
                bcrypt.compare(userData.password,user.password)
                .then((status)=>{
                    // console.log(status);
                    if(status==true){
                        response.user=user
                        resolve(response)
                    }
                    else{
                        response.status='Invalid Password'
                        resolve(response)
                        
                    }
                })

            }else{
                response.status='Invalid User'
                resolve(response)
                // console.log(response);
            }
        })
        

    }

}