import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import Category from './Category';

interface ProductAttributes {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  isActive: boolean;
  categoryId?: number;
  brand?: string;
  weight?: number;
  dimensions?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'isActive'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public price!: number;
  public stock!: number;
  public image?: string;
  public isActive!: boolean;
  public categoryId?: number;
  public brand?: string;
  public weight?: number;
  public dimensions?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 关联属性
  public category?: Category;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    underscored: true,
  }
);

// 关联
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

export default Product;
