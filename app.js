const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const csrf = require("csurf");
const flash = require("connect-flash");

const db = require("./config/database").mongoURI;

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: db,
  collection: "sessions"
});

const csrfProtection = csrf();

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/User");

const errorsController = require("./controllers/errors");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use("/500", errorsController.get500Page);

app.use(errorsController.get404Page);

app.use((error, req, res, next) => {
  res.redirect("/500");
});

mongoose
  .connect(db)
  .then(() => {
    app.listen(3000, () => console.log("Server started"));
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
