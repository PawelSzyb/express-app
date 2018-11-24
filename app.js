const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const rootDirectory = require("./utils/path");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000, () => console.log(`Server started at port ${3000}`));
