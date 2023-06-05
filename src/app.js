require("dotenv/config")
const express = require("express")
const app = express()

const routes = require("./routes/")

app.use(express.json())
app.use(routes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("Listening on Port: " + PORT)
})