const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./utils/database");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

db.execute("SELECT * FROM products");

const errorsController = require("./controllers/errors");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use(errorsController.get404Page);

app.listen(3000, () => console.log(`Server started at port ${3000}`));
