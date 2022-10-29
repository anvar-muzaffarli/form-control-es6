const myUl = document.querySelector('ul')

// window.onload = getJSONfromAPIWithPromise
window.onload = getJSONfromAPIWithAxios


function getJSONfromAPIWithAxios() {
    axios('https://jsonplaceholder.typicode.com/posts',{
        params: {
            _limit:10
        }
    })
        .then(response =>ekranaCapEt(response.data))
        .catch(xeta => console.log("Xeta bash verdi"))
}

// function getJSONfromAPIWithPromise(e) {
//     e.preventDefault()
//     fetch('https://jsonplaceholder.typicode.com/posts')
//          .then(response => response.json())
//          .then(netice => ekranaCapEt(netice))
//          .catch(xeta => console.log("xeta bash verdi" + xeta))
// }


function ekranaCapEt(posts) {
    let ekranPrint = ''


    posts.forEach(post => {
        ekranPrint += `<li> ${post.title} </li>`
    })

    myUl.innerHTML = ekranPrint


    
}