const mongoose = require("mongoose");
const string = process.env.URI;

mongoose
  .connect(string)
  .then(() => console.log(`DB connected 🎉`))
  .catch((err) => console.error(`DB Connection Error: ${err.message}`));
