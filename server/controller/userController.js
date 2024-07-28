import { UserModel } from "../postgres/postgres.js"
import Jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';

const jwt = Jwt;

export const getAllItems =async (req, res) => {
    try{
        const users =await UserModel.findAll();
        if(users.length === 0){
            return res.status(200).json({"error":"No any data found"})
        }
        return res.status(200).json(users)
    }
    catch(error){
        console.log('ERROR', error)
        handleErrors(error)
    }
    console.log('Success')
}

export const getById =async (req, res) => {
    const id = req.params.userId
    try{
        const users =await UserModel.findOne({where: {userId:id}});
        if(users.length === 0){
            return res.status(200).json({"error":"No any data found"})
        }
        return res.status(200).json(users)
    }
    catch(error){
        console.log('ERROR', error)
        handleErrors(error)
    }
    console.log('Success')
}

const handleErrors = (err) => {
    console.log(er.message, err.code)
}

const maxAge = 60 * 60 * 24
const jsonWebToken = (userId) => {
    return jwt.sign({userId}, 'test node', {
        expiresIn: maxAge
    })
}

export const addUser = async(req, res) => {
    try{
        const userId = uuidv4()
        req.body.userId = userId
        const existingUser = await UserModel.findOne({where: {userId:userId}})
        if(existingUser === null){
            const user = await UserModel.create(req.body);
            if(user.dataValues){
                const token = jsonWebToken(user.dataValues.userId)
                res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge * 1000})
                return res.status(200).json({'message':'User created successfully', token, userId})
            }
            return res.status(200).json({'message':'Error creating user!'})
        }
        return res.status(200).json({'message':'Existing user found!'})
    } catch (error){
        console.log(error, 'ERROR')
    }
}

export const updateUser = async(req, res) => {
    try{
        const userId = req.params.userId;
        const response = await UserModel.update(req.body, {where:{userId:userId}});
        if(response[0] === 0){
            return res.status(200).json({'message':'No existing user found'})
        }
        console.log('RESP', response)
        return res.status(200).json({'message':'User updated successfully'})
    } catch (error){
        console.log(error, 'ERROR')
    }
}

export const deleteUser = async(req, res) => {
    try{
        const userId = req.params.userId
        const existingUser = await UserModel.findOne({where: {userId:userId}})
        if(existingUser === null){
            return res.status(200).json({'message':'No existing user found'})
        }
        await existingUser.destroy();
        return res.status(200).json({'message':'User deleted successfully'})
    } catch (error){
        console.log(error, 'ERROR')
    }
}