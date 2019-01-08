const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

const db = require("./config/database").mongoURI;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/User");

const errorsController = require("./controllers/errors");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  User.findById("5c312502c6906c1428e8d390")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use(errorsController.get404Page);

mongoose
  .connect(db)
  .then(() => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Max",
          email: "max@test.com",
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000, () => console.log("Server started"));
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
