import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'isActive'> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public slug!: string;
  public description?: string;
  public image?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
    underscored: true,
  }
);

export default Category;
