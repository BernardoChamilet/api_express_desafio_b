import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.mjs';

export const Tag = sequelize.define('Tag', {
    tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tag_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 100]
        }
    }
}, {
    tableName: 'tags',
    timestamps: false
});