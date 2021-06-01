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
app.get("/:name", async (req, res) => {
    const url = "https://api.nasa.gov/mars-photos/api/v1/";
    const name = req.params.name
    try {
      const roverManifest = await fetch(`${url}manifests/${name}?api_key=${process.env.API_KEY}`)
        .then(res => res.json());
      const max_date = roverManifest["photo_manifest"]["max_date"];
      const roverPhotos = await fetch(`${url}rovers/${name}/photos?earth_date=${max_date}&api_key=${process.env.API_KEY}`)
        .then(res => res.json());
      res.send(roverPhotos);
  
    } catch (err) {
      console.log("errors:", err);
    }
  })
// app.get('/:name', async (req, res) => {
//     const rover_name = req.params.name;
//     const path = "https://api.nasa.gov/mars-photos/api/v1/"
//     try {
//         let manifest = await fetch(`${path}manifests/${rover_name}?api_key=${process.env.API_KEY}`)
//             .then(res => res.json())
//         const max_date = manifest['photo_manifest']['max_date']
//         const photos = await fetch(`${path}rovers/${rover_name}/photos?earth_date=${max_date}&api_key=${process.env.API_KEY}`)
//             .then(res => res.json());
//         res.send(photos);        
//     } catch (err) {
//         console.log('error:', err);
//     }
// })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))