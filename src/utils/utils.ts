import Joi from 'joi'
import jwt from 'jsonwebtoken'
export const createNoteSchema = Joi.object().keys({
    title:Joi.string().lowercase().required(),
    description: Joi.string().lowercase(),
    DueDate: Joi.string().lowercase(),
    status: Joi.string().lowercase(),
    userid: Joi.string()
});

export const updateNoteSchema = Joi.object().keys({
    title:Joi.string().lowercase(),
    description: Joi.string().lowercase(),
    DueDate: Joi.string().lowercase(),
    status: Joi.string().lowercase()
});

export const registerSchema = Joi.object().keys({
    firstname:Joi.string().required(),
    lastname:Joi.string().required(),
    email:Joi.string().trim().lowercase().required(),
    phonenumber:Joi.string().length(11).pattern(/^[0-9]+$/).required(),
    password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirm_password:Joi.ref("password")
}).with('password', 'confirm_password')

export const loginSchema = Joi.object().keys({
    email:Joi.string().trim().lowercase().required(),
    password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  
})

//Generate Token
export const generateToken=(user:{[key:string]:unknown}):unknown=>{
  const pass = process.env.JWT_SECRET as string
   return jwt.sign(user,pass, {expiresIn:'7d'})
}

export const options ={  
    abortEarly:false,
    errors:{
        wrap:{
            label: ''
        }
    }
}