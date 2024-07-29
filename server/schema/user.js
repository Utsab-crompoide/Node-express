import { DataTypes } from 'sequelize';

export const userModel = async (sequelize) => {

    const User = sequelize.define('User', {
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name cannot be empty"
                }
            }
        }, 
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Must be a valid email address"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [6, undefined],
                    msg: "Password must be at least 6 characters long"
                }
            }
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
    return User;
};
