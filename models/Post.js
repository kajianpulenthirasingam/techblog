const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
  }
);
Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Post.hasMany(models.Comment, {
      foreignKey: 'postId',
      onDelete: 'CASCADE'
    });
  };
  
module.exports = Post;
