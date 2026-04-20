import { DataTypes } from "sequelize";

export const FutsalModel = async (sequelize) => {
    const Futsal = sequelize.define("Futsal", {
        futsalId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name cannot be empty"
                }
            }
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Location cannot be empty"
                }
            }
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Price cannot be empty"
                }
            }
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "User ID cannot be empty"
                }
            }
        }
    })
    return Futsal;
};