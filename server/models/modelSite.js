const sequelize = require('../dbSite')
const {DataTypes, BOOLEAN} = require('sequelize')

const UserSite = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    address: {type: DataTypes.STRING, allowNull: true},
    username: {type: DataTypes.STRING, unique: true, allowNull: true},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: 'CUSTOMER', allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING},
    telephone: {type: DataTypes.STRING, unique: true},
    vkId: {type: DataTypes.INTEGER, unique: true},
    lastVisitDate: {type: DataTypes.DATE}
})


const OrderSite = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    orderNumber: {type: DataTypes.STRING, unique: true, allowNull: false},
    accessLink: {type: DataTypes.STRING, unique: true, allowNull: false},
    orderAddress: {type: DataTypes.STRING, allowNull: true},
    customerEmail: {type: DataTypes.STRING, allowNull: true},
    customerName: {type: DataTypes.STRING, allowNull: false},
    customerTel: {type: DataTypes.STRING, allowNull: false},
    salesSum: {type: DataTypes.INTEGER},
    bonusPointsUsed: {type: DataTypes.FLOAT, allowNull: true},
    orderDiscount: {type: DataTypes.FLOAT, allowNull: true},
    discountedSalesSum: {type: DataTypes.INTEGER, allowNull: false},
    extraBonus: {type: DataTypes.FLOAT},
    accruedBonus: {type: DataTypes.FLOAT, allowNull: true},
    deliverySum: {type: DataTypes.INTEGER, allowNull: true},
    status: {type: DataTypes.STRING, allowNull: false, defaultValue: 'Создан'},
    comment: {type: DataTypes.STRING, allowNull: true, defaultValue: ''},
    read: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false}

})

const OrderItemSite = sequelize.define( 'order_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    price: {type: DataTypes.INTEGER, allowNull: false},
    discountedPrice: {type: DataTypes.FLOAT, allowNull: true},
    qty: {type: DataTypes.INTEGER, allowNull: false},
    sum: {type: DataTypes.INTEGER, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false}
}, {timestamps: false})

const BonusPointSite = sequelize.define('bonus_point', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    currentQty: {type: DataTypes.FLOAT, defaultValue: 0, allowNull: false},
    frozenPoints: {type: DataTypes.FLOAT, defaultValue: 0, allowNull: true}
}, { timestamps: false })

const BonusPointsLogSite = sequelize.define('bonus_points_log', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    qtyChanges: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false}
})


const CategorySite = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: true},
    ordering: {type: DataTypes.INTEGER, defaultValue: 100},
    published: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {timestamps: false})


const ProductSite = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    SKU: {type: DataTypes.STRING, unique: true, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: false},
    shortDescription: {type: DataTypes.STRING, allowNull: true},
    description: {type: DataTypes.TEXT, allowNull: true, defaultValue: ''},
    weight: {type: DataTypes.INTEGER, allowNull: true},
    price: {type: DataTypes.FLOAT, defaultValue: null, allowNull: true},
    discountedPrice: {type: DataTypes.INTEGER, defaultValue: null, allowNull: true},
    metaTitle: {type: DataTypes.STRING, allowNull: true, defaultValue: ''},
    metaDescription: {type: DataTypes.STRING, allowNull: true, defaultValue: ''},
    indexNumber: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 9999},
    searchKeys: {type: DataTypes.TEXT, allowNull: true},
    pack: {type: DataTypes.INTEGER, defaultValue: 1},
    special: {type: DataTypes.BOOLEAN, defaultValue: false},
    published: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    inStock: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
    hidden: {type: DataTypes.BOOLEAN, defaultValue: false},
    specialBonus: {type: DataTypes.FLOAT, defaultValue: 0}
}, {timestamps: false})



const PaymentMethodSite = sequelize.define('payment_method', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true}
}, {timestamps: false})

const DeliveryMethodSite = sequelize.define('delivery_method', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    price: {type: DataTypes.INTEGER, allowNull: false},
    freeSum: {type: DataTypes.INTEGER, allowNull: true},
    minSum: {type: DataTypes.INTEGER, allowNull: true}
}, {timestamps: false})

const Product_Category_Site = sequelize.define('Product_Category', {
    productId: {type: DataTypes.INTEGER},
    categoryId: {type: DataTypes.INTEGER},
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: `Product_Category`,
})


UserSite.hasOne(BonusPointSite)
BonusPointSite.belongsTo(UserSite)

BonusPointSite.hasMany(BonusPointsLogSite)
BonusPointsLogSite.belongsTo(BonusPointSite)

UserSite.hasMany(OrderSite)
OrderSite.belongsTo(UserSite)

PaymentMethodSite.hasMany(OrderSite)
OrderSite.belongsTo(PaymentMethodSite)

DeliveryMethodSite.hasMany(OrderSite)
OrderSite.belongsTo(DeliveryMethodSite)

OrderSite.hasMany(OrderItemSite)
OrderItemSite.belongsTo(OrderSite)

ProductSite.hasOne(OrderItemSite)
OrderItemSite.belongsTo(ProductSite)

OrderSite.hasOne(BonusPointsLogSite)
BonusPointsLogSite.belongsTo(OrderSite)

ProductSite.hasMany(ProductSite, {as: "children", foreignKey: "productId"})
ProductSite.belongsTo(ProductSite, {as: "parent", foreignKey: "productId"})

CategorySite.hasMany(CategorySite, {as: "children", foreignKey: "categoryId"})
CategorySite.belongsTo(CategorySite, {as: "parent", foreignKey: "categoryId"})

CategorySite.belongsToMany(ProductSite, {through: 'Product_Category', as: 'product'})
ProductSite.belongsToMany(CategorySite, {through: 'Product_Category', as: 'category'})

module.exports = {
    UserSite,
    OrderSite,
    OrderItemSite,
    BonusPointSite,
    BonusPointsLogSite,
    CategorySite,
    ProductSite,
    PaymentMethodSite,
    DeliveryMethodSite,
    Product_Category_Site,
}