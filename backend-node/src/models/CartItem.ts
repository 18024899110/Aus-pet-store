import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import User from './User';
import Product from './Product';

interface CartItemAttributes {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id'> {}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public quantity!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'cart_items',
    timestamps: true,
    underscored: true,
  }
);

CartItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
User.hasMany(CartItem, { foreignKey: 'userId', as: 'cartItems' });

export default CartItem;
