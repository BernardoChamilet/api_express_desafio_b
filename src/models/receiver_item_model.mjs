import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.mjs';

export const Receiver_Item = sequelize.define('Receiver_Item', {
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'items',
            key: 'item_id'        
        },
        onDelete: 'CASCADE'
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'user_id'        
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'item_receiver',
    timestamps: false
});