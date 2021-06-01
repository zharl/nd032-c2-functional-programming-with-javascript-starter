let store = {
    info: '',
    rover: 'Curiosity',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
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
            <h1 style = "text-align:center"> Welcome to the Mars-Dashboard! </h1>
            <div align = "center">
                <h3> To see latest rover data, select the Mars rover: </h3>
                <select id = "rovers" onchange = "selectRover()" >
                    <option value = "curiosity" ${roverSelected("curiosity")}> curiosity </option>
                    <option value = "opportunity" ${roverSelected("opportunity")}> opportunity </option>
                    <option value = "spirit" ${roverSelected("spirit")}> spirit </option>
                </select>
                <p>
                    Latest Information for the rover: ${state.rover}
                    ${RoverInfo(state)}
                </p>             
            </div>
        </main>
        <footer></footer>
    `
}
const selectRover = () => {
    var rover = document.getElementById("rovers").value;

    store.rover = rover;

    getInfo(store)
    // getPhotos(store)

}
const roverSelected = (rover) => {
    if (rover === store.rover) {
        return "selected"
    } else {
        return null;
    } 
}
window.addEventListener('load', () => {
    render(root, store)
})
// Pure functions

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
    console.log(`${state.rover}: ${state.info.max_date}`)
}