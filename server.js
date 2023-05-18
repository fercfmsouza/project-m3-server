const app = require("./app");
//const connection = require("./db/reset.js");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;

//connection();

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
