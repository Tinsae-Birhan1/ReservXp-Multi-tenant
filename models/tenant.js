const mongoose = require("mongoose");

const tenant = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tenantSlug: { type: String, required: true, unique: true },
    username: { type: String },
    email: { type: String },
    password: {type:String},
    isActive: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model("tenant", tenant);

