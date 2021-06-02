let store = {
    info: '',
    rover: 'Curiosity',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}
const root = document.getElementById('root')

// update store with newly fetched photos / info
const updateStore = (state, newState) => {
    store = Object.assign(state, newState)
    render(root, state)
}
// update root with data from the store
const render = async (root, state) => {
    root.innerHTML = App(state, markupInfo, markupPhotos)
}
window.addEventListener('load', () => {
    getInfo(store.rover)
    getPhotos(store.rover)
    render(root, store)
})
//HOF #1
const isSelected = (state) =>{
 return (rover) => state.rover ==rover?"selected":null
}
// Contains several dynamic components
const App = (state, renderInfo, renderPhotos) => {
    selector = isSelected(state)
    return `
        <header></header>
        <main>
            <h1 style = "text-align:center"> Mars-Dashboard! </h1>
            <div align = "center">
                <h3> Select the Mars rover: </h3>
                <select id = "rovers" onchange = "selectRover()" >
                    <option value = "curiosity" ${selector('curiosity')}> curiosity </option>
                    <option value = "opportunity" ${selector('opportunity')}> opportunity </option>
                    <option value = "spirit" ${selector('spirit')}> spirit </option>
                </select>
                <p>
                    Latest Information for the rover: ${state.rover}
                    ${renderInfo(state.info)}
                    ${state.photos!=undefined?renderPhotos(state.photos):''}
                </p>             
            </div>
        </main>
        <footer></footer>
    `
}
const selectRover = () => {
    const rover = document.getElementById("rovers").value;
    store.rover = rover;
    getInfo(rover)
    getPhotos(rover)
}
const roverSelected = (rover) => {
    if (rover === store.rover) {
        return "selected"
    } else {
        return null;
    } 
}
//HOF #2 
const markup = (tag) =>{
    return (items) => items.map( (e) => `<${tag}> ${e} <${tag}/>`).join(" ")
}
// Pure functions for logic
const markupInfo = (info) => {
    return markup('p')([
        `Landing date: ${info.landing_date}`,
        `Launch date: ${info.launch_date}`,
        `Rover status: ${info.status}`,
        `The most recent photos were taken on: ${info.max_date}`
    ])
}

// Pure function using map
const markupPhotos = (photos) => {
    const markupPhoto = (photo) => {
        return `<img class="grid-image" src=${photo} height = 300px width = 300px/>`
    }
    return `
    <p> Recent photos : <h2/>
    <div class="image-grid">
        ${photos.map(photo => markupPhoto(photo.img_src)).join(" ")}
    </div>
    `
}
// ------------------------------------------------------  API CALLS
const getInfo = (rover) => {   
    fetch(`http://localhost:3000/info/${rover}`)
        .then(res => res.json())    
        .then(info => updateStore(store, { info }))
    console.log(`getting info for ${rover}`)
}
const getPhotos = (rover) => {   
    fetch(`http://localhost:3000/photos/${rover}`)
        .then(res => res.json())    
        .then(photos => updateStore(store, {photos}))
}