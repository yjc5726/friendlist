const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const friends = []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

//1. 請求資料
axios
	.get(INDEX_URL)
	.then((response) => {
		friends.push(...response.data.results)
		// console.log(friends)
		renderFriendList(friends)
	})
	.catch((err) => console.log(err))
//2.把資料放進網頁

//函式：將陣列資料迭代取出渲染到頁面
function renderFriendList(data) {
	let rawHTML = ''
	data.forEach((item) => {
		// title, image
		rawHTML +=
			`<div class="col-sm-3">
			<div class="mb-2">
				<div class="card">
					<img src="${item.avatar}" class="card-img-top" alt="Movie Poster">
					<div class="card-body">
						<h5 class="card-title">${item.name} ${item.surname}</h5>
					</div>
					<div class="card-footer">
						<button class="btn btn-primary btn-show-friend" data-toggle="modal" data-target="#friend-modal" data-id="${item.id}">More</button>
						<button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
					</div>
				</div>
			</div>
		</div>`
	})
	dataPanel.innerHTML = rawHTML
}

//3.委派事件：點擊卡片跳出該朋友詳細資料
// 監聽 data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
	if (event.target.matches('.btn-show-friend')) {
		showFriendModal(event.target.dataset.id)
	} //5. 監聽加入我的最愛
	else if (event.target.matches('.btn-add-favorite')) {
		addToFavorite(Number(event.target.dataset.id))
	}
})

//3.1發送request
function showFriendModal(id) {
	const modalTitle = document.querySelector('#friend-modal-title')
	const modalImage = document.querySelector('#friend-modal-image')
	const modalDate = document.querySelector('#friend-modal-date')
	const modalDescription = document.querySelector('#friend-modal-description')
	axios.get(INDEX_URL + id).then((response) => {
		// console.log(response.data)
		const data = response.data
		modalTitle.innerText = data.name
		modalDate.innerText = 'Birthday date: ' + data.birthday
		modalDescription.innerText = data.email
		modalImage.innerHTML = `<img src="${
      data.avatar
    }" alt="" class="img-fluid">`
	})
}

//4.搜尋功能
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
	event.preventDefault()
	const keyword = searchInput.value.trim().toLowerCase()
	let filteredFriends = []
	filteredFriends = friends.filter((friend) =>
		friend.title.toLowerCase().includes(keyword))
	//include如果是空字串或自動回傳全部結果
	if (filteredFriends.length === 0) {
		return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
	}
	renderMovieList(filteredMovies)
})

//5.1 函式addToFavorite
function addToFavorite(id) {
	const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
	const friend = friends.find((friend) => friend.id === id)
	if (list.some((friend) => friend.id === id)) {
		return alert('已把此朋友加入我的最愛了！')
	}
	list.push(list)
	localStorage.setItem('favoriteFriends', JSON.stringify(list))
}
