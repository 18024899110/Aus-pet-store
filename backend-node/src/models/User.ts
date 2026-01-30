import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface UserAttributes {
  id: number;
  email: string;
  hashedPassword: string;
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'isActive' | 'isAdmin'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public hashedPassword!: string;
  public fullName?: string;
  public phone?: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public postcode?: string;
  public country?: string;
  public isActive!: boolean;
  public isAdmin!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    hashedPassword: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    postcode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

export default User;
