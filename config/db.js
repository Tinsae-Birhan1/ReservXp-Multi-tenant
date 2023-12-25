const mongoose = require("mongoose");
//connect mongodb atlas
mongoose.connect(
  `mongodb+srv://tinsaebirhan7:${process.env.MONGODB_PASS}@cluster0.ovqcrvw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  );