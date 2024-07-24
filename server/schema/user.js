import { DataTypes } from "sequelize"

export const userModel = async (sequelize) => {

    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        email: {
            type: DataTypes.STRING,
            lowercase: true,
            required: [true, 'Email is required'],
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            required: [true, 'Password is required']
            
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return User;
}