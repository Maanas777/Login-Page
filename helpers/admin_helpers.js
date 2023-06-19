const db=require('../config/connection')
const bcrypt=require('bcrypt');
const collection=require('../config/collection');
const { reject } = require('bcrypt/promises');
const { ObjectId } = require('mongodb');
const { response } = require('express');




module.exports={

    getUser:()=>{
        return new Promise(async(resolve,reject)=>{
            const userData=await db.get().collection(collection.ADMIN_COLLECTION).find().toArray()
            resolve(userData)
        })
    },

    addUser: (data) => {
        return new Promise(async (resolve, reject) => {
          // Check if the email is already taken
          const existingUser = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: data.email });
          if (existingUser) {
            return reject(new Error('Email already taken'));
          }
      
          data.password = await bcrypt.hash(data.password, 10);
          db.get().collection(collection.ADMIN_COLLECTION).insertOne(data)
            .then((response) => {
              resolve(response);
            })
            .catch((err) => {
              reject(err);
            });
        });
      }
      ,

    editUser:(userId, data)=>{
        return new Promise((resolve,reject)=>{
            userId= new ObjectId(userId)
            db.get().collection(collection.ADMIN_COLLECTION).updateOne(
                {_id:userId},
                {$set:{
                    name:data.name,
                    email:data.email,
                    mobile:data.mobile
                }}
            )
            .then((response)=>{
                resolve()
            })
            .catch((err)=>{
                reject()
            })
        })
    },

    deleteUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ADMIN_COLLECTION).deleteOne(
                {_id:new ObjectId(userId)}
            )
            .then((response)=>{
                resolve()
            })
            .catch((err)=>{
                reject()
            })
        })
    },

    searchUser: (search) => {
        return new Promise(async (resolve, reject) => {
            const userData = await db.get().collection(collection.ADMIN_COLLECTION).find({
                name: {$regex: new RegExp(search)}
            }).toArray()
            .then((userData)=>{
                resolve(userData)
            })
            .catch(()=>{
                console.log('errr');
                reject()
            })
        })
    }
} 