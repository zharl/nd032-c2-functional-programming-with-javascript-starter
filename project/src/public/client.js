let store = {
    info: '',
    rover: 'Curiosity',
}
const root = document.getElementById('root')
const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}
const render = async (root, state) => {
    root.innerHTML = App(state)
}
const App = (state) => {
    return `
        <header></header>
        <main>
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${RoverInfo(state)}
            </section>
        </main>
        <footer></footer>
    `
}
window.addEventListener('load', () => {
    render(root, store)
})
// Pure functions
const RoverGallery = (rovers) => {
    rover = rovers[0].toLowerCase()
    console.log(rover)
    try{
        fetch(`http://localhost:3000/${rover}`)
        .then(res => res.json())
        .then(photos => updateStore(store, photos))
        let res = ''
        if (store.photos != undefined){
            const pct = 1./store.photos.length
            res+=`
                <img src="${store.photos[i].img_src}" height="350px" width="${pct}%" />
            `
        }
        return res
    }
    catch (err) {
        console.log(`errors: ${rover} - ${err}`)
    }
}
const RoverInfo = (state) => {
    if (!state.info) {
        getInfo(state);
    } else {
        console.log(state.info)
        const manifest = state.info
        const photoGrid = roverPhotos(state, markupPhoto)
        return `
            <p> Landing date: ${manifest.landing_date} <p/>
            <p> Launch date: ${manifest.launch_date} <p/>
            <p> Rover status: ${manifest.status} <p/>
            <p> The most recent photos were taken on: ${manifest.max_date} <p/> 
            <p> The most recent photos : <h2/>
            ${photoGrid}
            `
    }
}
//higher order function, takes in 1 callback
const roverPhotos = (state, cb) => {
    if (!state.photos) {
        getPhotos(state)
    } 
    else {
        return `
        <div class="image-grid">
            ${state.photos.map(photo => cb(photo.img_src)).join(" ")}
        </div>`
    }
}
const markupPhoto = (photo) => {
    return `<img class="grid-image" src=${photo} height = 300px width = 300px/>`
}
// ------------------------------------------------------  API CALLS
const getInfo = async (state) => {   
    fetch(`http://localhost:3000/info/${state.rover}`)
        .then(res => res.json())    
        .then(info => updateStore(state, { info }))
}
const getPhotos = async (state) => {   
    fetch(`http://localhost:3000/photos/${state.rover}/${state.info.max_date}`)
        .then(res => res.json())    
        .then(photos => updateStore(state, {photos}))
}