import { UserModel } from "../postgres/postgres.js"

export const getAllItems =async (req, res) => {
    try{
        const users =await UserModel.findAll();
        if(users.length === 0){
            return res.status(200).json({"error":"No any data found"})
        }
        return res.status(200).json(users)
    }
    catch(error){
        console.log(error)
    }
    console.log('Success')
}

export const addUser = async(req, res) => {
    try{
        const {name, email, userId} = req.body
        const existingUser = await UserModel.findOne({where: {userId:userId}})
        if(existingUser === null){
            await UserModel.create(req.body);
            return res.status(200).json({'message':'User created successfully'})
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