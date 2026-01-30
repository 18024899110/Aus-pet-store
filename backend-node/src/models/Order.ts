import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import User from './User';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  ALIPAY = 'alipay',
}

interface OrderAttributes {
  id: number;
  userId: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPostcode: string;
  shippingCountry: string;
  shippingPhone: string;
  shippingFee: number;
  tax: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'status'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public orderNumber!: string;
  public status!: OrderStatus;
  public totalAmount!: number;
  public paymentMethod!: PaymentMethod;
  public paymentId?: string;
  public shippingAddress!: string;
  public shippingCity!: string;
  public shippingState!: string;
  public shippingPostcode!: string;
  public shippingCountry!: string;
  public shippingPhone!: string;
  public shippingFee!: number;
  public tax!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
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
    orderNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      defaultValue: OrderStatus.PENDING,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM(...Object.values(PaymentMethod)),
      allowNull: false,
    },
    paymentId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shippingCity: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shippingState: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shippingPostcode: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    shippingCountry: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shippingPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    shippingFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
    underscored: true,
  }
);

Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

export default Order;
