const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const rootDirectory = require("./utils/path");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootDirectory, "views", "404.html"));
});

app.listen(3000, () => console.log(`Server started at port ${3000}`));
