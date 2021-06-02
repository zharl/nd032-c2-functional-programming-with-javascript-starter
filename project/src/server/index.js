require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get("/info/:name", async (req, res) => {
  const url = "https://api.nasa.gov/mars-photos/api/v1/";
  try {
    const manifest = await fetch(`${url}manifests/${req.params.name}?api_key=${process.env.API_KEY}`)
      .then(res => res.json());
    res.send(manifest.photo_manifest);
  } catch (err) {
    console.log("errors:", err);
  }
})
app.get("/photos/:name", async (req, res) => {
  const url = "https://api.nasa.gov/mars-photos/api/v1/rovers/";
  const queryString = `${url}${req.params.name}/latest_photos?api_key=${process.env.API_KEY}`
  try {
    const photos = await fetch(queryString)
    .then(res => res.json());
    res.send(photos['latest_photos']);
  } 
  catch (err) {
    console.log("errors:", err);
  }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))