const mongoose = require("mongoose");

const tenantDb = async function (req, res, next) {
    console.log('Tenant Database');
    await mongoose.connection.close();
    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_ACCOUNT}:${process.env.MONGODB_PASS}${process.env.MONGODB_CLUSTER}/${req.params.slug}?retryWrites=true&w=majority`);
    next();
};

const centralDb = async function (req, res, next) {
    console.log('Central Database');
    await mongoose.connection.close();
    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_ACCOUNT}:${process.env.MONGODB_PASS}${process.env.MONGODB_CLUSTER}/${req.params.slug}?retryWrites=true&w=majority`);
    next();
};

module.exports = { tenantDb, centralDb };
