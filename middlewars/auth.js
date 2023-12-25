const Tenant = require('../models/tenant');
const mongoose = require("mongoose");

const auth = async (req, res, next) => {
    console.log('cluster Auth', req.body);
    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_ACCOUNT}:${process.env.MONGODB_PASS}${process.env.MONGODB_CLUSTER}/${req.params.slug}?retryWrites=true&w=majority`);
    
    const doesItExist = await Tenant.findOne({ tenantSlug: req.params.slug });
    console.log(" Tenant ", doesItExist);
    
    await mongoose.connection.close();

    if (doesItExist) {
        req.database = req.params.slug;
        await mongoose.connect(`mongodb+srv://${process.env.MONGODB_ACCOUNT}:${process.env.MONGODB_PASS}${process.env.MONGODB_CLUSTER}/${req.params.slug}?retryWrites=true&w=majority`);
        next();
    } else {
        return res.status(403).json({ message: "Tenant does not found~" });
    }
};

const centralAuth = async (req, res, next) => {
    console.log('Central Auth ', req.body);
    await mongoose.connection.close();
    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_ACCOUNT}:${process.env.MONGODB_PASS}${process.env.MONGODB_CLUSTER}/${req.params.slug}?retryWrites=true&w=majority`);
    next();
};

module.exports = { auth, centralAuth };
