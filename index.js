
let currentList = 0
let numberOfLists = 0

const form = document.getElementById('input_form')
const listContainer = document.getElementById('response_list_container')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const url = 'https://api.pokemontcg.io/v1/cards?'
    const name = document.getElementById('name').value
    const input = 'name=' + name.charAt(0).toUpperCase() + name.slice(1)
    const request = url + input

    getRequest(request)
})

async function getRequest(url) {

    let data = ''
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Api-Key': 'b1380ec6-7efc-4709-b529-74c3f959676a',
            'Accept': 'application/json'
        }
    });
    data = await response.json();
    console.log(data.cards)

    createAllLists(data.cards)
}

function createAllLists(array) {
    let listLength = 6
    let listNumber = Math.floor(array.length / listLength)
    numberOfLists = listNumber
    const lists = document.createElement('div')

    changeImage(array[0].imageUrl)

    for (let x = 0; x < listNumber; x++) {
        const ul = createUL(x)
        array.splice(0, listLength).map((card) => {
            createList(card, lists, ul)
        })
    }

    if (array.length % listLength) {
        const ul = createUL(listNumber)
        numberOfLists++
        array.map(card => createList(card, lists, ul))
    }

    listContainer.replaceChildren(lists)

    document.getElementById('list-0').style.display = 'block'
}

function createList(card, lists, list) {

    const li = document.createElement('li')

    const button = document.createElement('button')
    button.innerHTML = 'Image'
    button.onclick = () => changeImage(card.imageUrl)

    const div = document.createElement('div')

    const h2 = document.createElement('h2')
    h2.innerHTML = card.name + ':'

    const h3 = document.createElement('h3')
    h3.innerHTML = card.set + ' | ' + card.series

    div.appendChild(h2)
    div.appendChild(h3)
    li.appendChild(div)
    li.appendChild(button)
    list.appendChild(li)
    lists.appendChild(list)
}

function createUL(x) {
    const ul = document.createElement('ul')
    ul.setAttribute('id', 'list-' + x)
    ul.classList.add('list')
    return ul
}

function changeImage(url) {
    document.querySelector('#image').src = url
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
    newList.style.display = 'block'
}

function moveListsRight() {
    const oldList = document.getElementById('list-' + currentList)
    oldList.style.display = 'none'

    currentList = currentList + 1

    const newList = document.getElementById('list-' + currentList)
    newList.style.display = 'block'
}