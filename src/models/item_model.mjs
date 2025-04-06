import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.mjs';

export const Item = sequelize.define('Item', {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    item_description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 255]
        }
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 255]
        }
    },
    item_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    },
    creator: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'        
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'items',
    timestamps: false
});