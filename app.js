const express = require("express");
const config = require("config");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(express.static(path.join(__dirname, "frontend/build")));

app.use(
  express.json({
    extended: true,
  })
);
app.use("/api/auth", require("./routes/auth.routes.js"));
app.use("/api/check", require("./routes/check.routes.js"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build/index.html"));
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(
      config.get("mongoUri"),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      () => console.log(`DB has been connected successfully`)
    );
    app.listen(PORT, () =>
      console.log(`App has been started on port ${PORT}...`)
    );
  } catch (e) {
    console.log(`Server Error: ${e.message}`);
    process.exit(1);
  }
};

start();
