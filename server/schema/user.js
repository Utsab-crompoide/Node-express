import { DataTypes } from 'sequelize';

export const userModel = async (sequelize) => {

    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
    return User;
};
