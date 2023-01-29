
let currentList = 0
let numberOfLists = 0

const form = document.getElementById('input_form')
const listContainer = document.getElementById('response_list_container')
const seriesList = document.getElementById('series_list')
const seriesTitle = document.getElementById('series_title')
const hamberger = document.getElementById('hamberger')
const filters = document.getElementById('filter_container')

seriesList.style.display = 'none'
seriesTitle.onclick = () => expandSort(seriesList, seriesTitle)

function expandSort(list, title) {
    if (list.style.display == 'none') {
        openLists(list, title)
        return
    } else {
        closeLists(list, title)
    }
}

function openLists(list, title) {
    list.style.display = 'block'
    title.children[0].innerHTML = '-- '
    title.classList.add('open')
    expandFilters()
}

function closeLists(list, title) {
    list.style.display = 'none'
    title.children[0].innerHTML = '+ '
    title.classList.remove('open')
}

hamberger.onclick = () => toggleFilters()

function toggleFilters() {
    if (hasClass(filters, 'hidden')) {
        expandFilters()
        return
    }
    colapseFilters()
}

function expandFilters() {
    filters.classList.remove('hidden')
}

function colapseFilters() {
    filters.classList.add('hidden')
    const titles = document.querySelectorAll('.filter_title')
    const lists = document.querySelectorAll('.filter_list')

    for (let x = 0; x < titles.length; x++) {
        closeLists(lists[x], titles[x])
    }
}

function hasClass(element, clsName) {
    return (' ' + element.className + ' ').indexOf(' ' + clsName + ' ') > -1;
}

/*** SUBMIT REQUEST ***/

form.addEventListener('submit', async function (e) {
    e.preventDefault()

    const url = 'https://api.pokemontcg.io/v1/cards?'
    const name = document.getElementById('name').value
    const input = 'name=' + name.charAt(0).toUpperCase() + name.slice(1)
    const request = url + input

    const data = await getRequest(request)
    const cards = data.cards
    console.log(cards)
    createSeriesList(cards)
    createAllLists(cards)
    openLists(seriesList, seriesTitle)
})

async function getRequest(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Api-Key': 'b1380ec6-7efc-4709-b529-74c3f959676a',
            'Accept': 'application/json'
        }
    })
    return response.json()
}

function createAllLists(array) {
    let ulID = 0
    currentList = 0
    let listLength = 18
    let listNumber = Math.floor(array.length / listLength)
    numberOfLists = listNumber
    const lists = document.createElement('div')

    for (let x = 0; x < array.length; x += listLength) {
        const ul = createUL(ulID)
        array.slice(x, x + listLength).map((card) => {
            createList(card, lists, ul)
        })
        ulID++
    }

    const remander = array.length % listLength
    if (remander && array.length > remander) {
        const lastCards = array.slice(remander, array.length)
        const ul = createUL(ulID)
        numberOfLists++
        lastCards.map(card => createList(card, lists, ul))
    }

    listContainer.replaceChildren(lists)

    document.getElementById('list-0').style.display = 'grid'
}

function createList(card, lists, list) {

    const li = document.createElement('li')
    const img = document.createElement('img')
    img.src = card.imageUrl
    img.onclick = () => changeImage(card)

    li.appendChild(img)
    list.appendChild(li)
    lists.appendChild(list)
}

// function createList(card, lists, list) {

//     const li = document.createElement('li')

//     const button = document.createElement('button')
//     button.innerHTML = 'Image'
//     button.onclick = () => changeImage(card.imageUrl)

//     const div = document.createElement('div')

//     const h2 = document.createElement('h2')
//     h2.innerHTML = card.name + ':'

//     const h3 = document.createElement('h3')
//     h3.innerHTML = card.set + ' | ' + card.series

//     div.appendChild(h2)
//     div.appendChild(h3)
//     li.appendChild(div)
//     li.appendChild(button)
//     list.appendChild(li)
//     lists.appendChild(list)
// }

function createUL(x) {
    const ul = document.createElement('ul')
    ul.setAttribute('id', 'list-' + x)
    ul.classList.add('list')
    return ul
}

function createSeriesList(array) {
    const cards = array
    const seriesList = {}
    const list = document.getElementById('series_list')
    list.replaceChildren('')

    cards.map(card => {
        const series = card.series
        seriesList[card.series] = series
    })

    Object.values(seriesList).forEach(value => {
        const li = document.createElement('li')
        li.innerHTML = value
        li.onclick = () => onclickFilter(value, cards)
        list.appendChild(li)
    })
}

function onclickFilter(value, array) {
    const filtered = array.filter(card => {
        if (card.series == value) {
            return card
        }
    })
    createAllLists(filtered)
}

const modal = document.getElementById('image_modal')
const imageContainer = document.getElementById('image_container')

const rightContainer = document.querySelector('.right_container')

function changeImage(card) {
    const container = document.createElement('div')
    const div2 = document.createElement('div')
    const div3 = document.createElement('div')
    const name = document.createElement('h1')
    const setName = document.createElement('h2')
    const seriesName = document.createElement('h3')
    const set = document.createElement('h4')
    const series = document.createElement('h4')

    name.innerHTML = card.name
    set.innerHTML = "Set: "
    setName.innerHTML = card.set
    series.innerHTML = "Series: "
    seriesName.innerHTML = card.series

    container.classList.add('card_info')
    div2.classList.add('card_text')
    div3.classList.add('card_text')

    container.appendChild(name)
    div2.appendChild(set)
    div2.appendChild(setName)
    container.appendChild(div2)
    div3.appendChild(series)
    div3.appendChild(seriesName)
    container.appendChild(div3)

    rightContainer.insertBefore(container, rightContainer.children[0])

    document.querySelector('#image').src = card.imageUrlHiRes
    modal.style.display = 'flex'
}

document.getElementById('close_modal').onclick = () => modal.style.display = 'none'

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

document.getElementById('left_button').onclick = () => {
    if (currentList > 0) moveListsLeft()
}
document.getElementById('right_button').onclick = () => {
    if (currentList < numberOfLists - 1) moveListsRight()
}

function moveListsLeft() {
    const oldList = document.getElementById('list-' + currentList)
    oldList.style.display = 'none'

    currentList = currentList - 1

    const newList = document.getElementById('list-' + currentList)
    newList.style.display = 'grid'
}

function moveListsRight() {
    const oldList = document.getElementById('list-' + currentList)
    oldList.style.display = 'none'

    currentList = currentList + 1

    const newList = document.getElementById('list-' + currentList)
    newList.style.display = 'grid'
}