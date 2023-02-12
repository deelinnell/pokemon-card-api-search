let allCards = []
let currentArray = []
let currentModalIndex = ''
let currentList = 0
let loadedLists = {}
let numberOfLists = 0
let listLength = 18

/*** SUBMIT REQUEST ***/

const form = document.getElementById('input_form')
const listContainer = document.getElementById('response_list_container')

form.addEventListener('submit', async function (e) {
    e.preventDefault()

    const url = 'https://api.pokemontcg.io/v1/cards?'
    const name = document.getElementById('name').value
    const input = 'name=' + name.charAt(0).toUpperCase() + name.slice(1)
    const request = url + input

    const data = await getRequest(request)
    const cards = data.cards
    allCards = cards

    createSeriesList(cards)
    createSubtypeList(cards)
    createAllLists(cards)
    openLists(seriesList, seriesTitle)

    document.querySelector('.background').style.opacity = '0.4'
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
    loadedLists = {}
    let listNumber = Math.floor(array.length / listLength)
    numberOfLists = listNumber
    const div = document.createElement('div')

    for (let x = 0; x < array.length; x += listLength) {
        const list = createList(ulID)
        div.appendChild(list)
        ulID++
    }

    const remander = array.length % listLength
    if (remander && array.length > remander) {
        const list = createList(ulID)
        div.appendChild(list)
        numberOfLists++
    }

    listContainer.replaceChildren(div)

    data = array
    displayImages()
}

function createList(ulID) {
    const ul = document.createElement('ul')
    ul.setAttribute('id', 'list-' + ulID)
    ul.classList.add('list')
    return ul
}

function addCardsToList(lists, list) {
    lists.appendChild(list)
}

/**** CARD FUNCTIONS ****/

function displayImages() {
    const listId = 'list-' + currentList
    const list = document.getElementById(listId)
    const start = currentList * listLength
    const end = (currentList + 1) * listLength

    currentArray = data.slice(start, end)
    currentArray.map(card => createCard(card, list))
    list.style.display = 'grid'
    loadedLists[listId] = true
}

function createCard(card, list) {
    const li = document.createElement('li')
    const img = document.createElement('img')
    img.src = card.imageUrl
    img.onclick = () => cardOnclick(card)
    li.appendChild(img)
    list.appendChild(li)
}

function cardOnclick(card) {
    currentModalIndex = currentArray.indexOf(card)
    console.log(card)

    const container = createCardInfo(card)
    const container2 = createCardInfo(card)

    modalCardInfo.replaceChildren(container)
    rightContainer.insertBefore(container2, rightContainer.children[0])

    changeImage(card.imageUrlHiRes)
    modalButtons()

    modal.style.display = 'flex'
}

function createCardInfo(card) {
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

    return container
}

/**** FILTER TOGGLES ****/

const seriesList = document.getElementById('series_list')
const subtypeList = document.getElementById('subtype_list')
const seriesTitle = document.getElementById('series_title')
const subtypeTitle = document.getElementById('subtype_title')
const hamberger = document.getElementById('hamberger')
const filters = document.getElementById('filter_container')
const allButton = document.getElementById('all_button')
const allChains = document.getElementById('all_chains')
const lists = document.querySelectorAll('.filter_list')
const titles = document.querySelectorAll('.filter_title')

seriesTitle.onclick = () => expandSort(seriesList, seriesTitle)
subtypeTitle.onclick = () => expandSort(subtypeList, subtypeTitle)

function expandSort(list, title) {
    if (hasClass(list, 'open')) {
        closeLists(list, title)
        return
    } else {
        console.log(lists)
        lists.forEach((li, index) => closeLists(li, titles[index]))
        openLists(list, title)
    }
}

function openLists(list, title) {
    list.classList.add('open')
    title.children[0].innerHTML = '-- '
    title.classList.add('open')
    expandFilters()
}

function closeLists(list, title) {
    list.classList.remove('open')
    title.children[0].innerHTML = '+ '
    title.classList.remove('open')
}

hamberger.onclick = () => toggleFilters()

function toggleFilters() {
    if (hasClass(filters, 'hidden')) {
        expandFilters()
        return
    }
    collapseFilters()
}

function expandFilters() {
    filters.classList.remove('hidden')
    setTimeout(() => {
        allButton.classList.remove('hidden')
        allChains.classList.remove('hidden')
    }, 200)
}

function collapseFilters() {
    filters.classList.add('hidden')
    allButton.classList.add('hidden')
    allChains.classList.add('hidden')
    const titles = document.querySelectorAll('.filter_title')
    const lists = document.querySelectorAll('.filter_list')

    for (let x = 0; x < titles.length; x++) {
        closeLists(lists[x], titles[x])
    }
}

function hasClass(element, clsName) {
    return (' ' + element.className + ' ').indexOf(' ' + clsName + ' ') > -1;
}

// **** FILTER FUNCTIONS ****

allButton.onclick = () => createAllLists(allCards)

function createSeriesList(cards) {
    let seriesList = {}
    const list = document.getElementById('series_list')
    list.replaceChildren('')

    cards.map(card => {
        const series = card.series
        seriesList[card.series] = series
    })

    Object.values(seriesList).forEach(value => {
        const li = document.createElement('li')
        li.innerHTML = value
        li.onclick = () => onclickSeries(value, cards)
        list.appendChild(li)
    })
}

function onclickSeries(value, cards) {
    const filtered = cards.filter(card => {
        if (card.series == value) {
            return card
        }
    })
    createAllLists(filtered)
}

function createSubtypeList(cards) {
    let subtypeList = {}
    const list = document.getElementById('subtype_list')
    list.replaceChildren('')

    cards.map(card => {
        const subtype = card.subtype
        subtypeList[card.subtype] = subtype
    })

    Object.values(subtypeList).forEach(value => {
        const li = document.createElement('li')
        li.innerHTML = value
        li.onclick = () => onclickSubtype(value, cards)
        list.appendChild(li)
    })
}

function onclickSubtype(value, cards) {
    const filtered = cards.filter(card => {
        if (card.subtype == value) {
            return card
        }
    })
    createAllLists(filtered)
}

/*** MODAL ***/

const modal = document.getElementById('image_modal')
const imageContainer = document.getElementById('image_container')
const modalCardInfo = document.getElementById('model_card_info')

const rightContainer = document.querySelector('.right_container')

function modalButtons() {
    const left = document.getElementById('modal_left')
    const right = document.getElementById('modal_right')
    left.onclick = () => {
        if (currentModalIndex === 0) {
            currentModalIndex = currentArray.length - 1
        } else {
            currentModalIndex--
        }
        const card = currentArray[currentModalIndex]
        changeImage(card.imageUrlHiRes)
        const container = createCardInfo(card)
        const container2 = createCardInfo(card)
        modalCardInfo.replaceChildren(container)
        rightContainer.insertBefore(container2, rightContainer.children[0])
    }
    right.onclick = () => {
        if (currentModalIndex === currentArray.length - 1) {
            currentModalIndex = 0
        } else {
            currentModalIndex++
        }
        const card = currentArray[currentModalIndex]
        changeImage(card.imageUrlHiRes)
        const container = createCardInfo(card)
        const container2 = createCardInfo(card)
        modalCardInfo.replaceChildren(container)
        rightContainer.insertBefore(container2, rightContainer.children[0])
    }
}

function changeImage(url) {
    document.querySelector('#image').src = url
}

document.getElementById('close_modal').onclick = () => modal.style.display = 'none'

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

/** LIST BUTTONS **/

document.getElementById('left_button').onclick = () => (currentList > 0) ? changeList(currentList - 1) : false
document.getElementById('right_button').onclick = () => (currentList < numberOfLists - 1) ? changeList(currentList + 1) : false

function changeList(listNum) {
    const oldList = document.getElementById('list-' + currentList)
    oldList.style.display = 'none'

    currentList = listNum

    const newListId = 'list-' + currentList
    if (!loadedLists[newListId]) {
        displayImages()
    } else {
        document.getElementById(newListId).style.display = 'grid'
        const start = currentList * listLength
        const end = (currentList + 1) * listLength
        currentArray = data.slice(start, end)
    }
}