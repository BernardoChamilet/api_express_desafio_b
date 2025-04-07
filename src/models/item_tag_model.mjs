import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.mjs';

export const Item_Tag = sequelize.define('Item_Tag', {
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
    tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'tags',
            key: 'tag_id'        
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'item_tag',
    timestamps: false
});