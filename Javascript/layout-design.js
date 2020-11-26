vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
container = document.getElementById('container')
selector = document.getElementById('selector')
pagesElement = document.getElementById('pages')
var pageElement = document.createElement('div')
pageElement.className = 'page'
pageElement.innerHTML = 'page'
function initializePages(){
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
	var viewwidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
	Array.from(pagesElement.children).forEach((e) => {
		if (e.id != 'selector') {
			e.remove()
		}
	})
	var smol = (viewwidth <= 1100)
	pageElement.className = 'page'
	pageElement.innerHTML = smol ? 'Activities' : 'Today'
	pagesElement.appendChild(pageElement)
	var secondPage = pageElement.cloneNode(true)
	secondPage.innerHTML = smol ? 'Sessions' : 'History'
	pagesElement.appendChild(secondPage)
	if (smol) {
		var thirdPage = pageElement.cloneNode(true)
		thirdPage.innerHTML = 'History'
		pagesElement.appendChild(thirdPage)
	}
	pages = Array.from(document.getElementsByClassName('page'))
	pagesElement.style.gridTemplateColumns = `repeat(${pages.length}, 1fr)`;
	pages[0].className = 'page selected'
	pages.forEach((p, i) => {
		p.onclick = () => {
			choosePage(i)
		}
	})
	selector.style.width = 100/pages.length + '%'
	// var timeWidth = document.getElementById('total-time-container').offsetWidth
	// var breakWidth = document.getElementById('total-break-container').offsetWidth
	// document.getElementById('total-time-container').style.fontSize = (timeWidth < 330 ? timeWidth/8 : timeWidth/10) + 'px'
	// document.getElementById('total-break-container').style.fontSize = (timeWidth < 330 ? breakWidth/7 : breakWidth/9) + 'px'
}
initializePages()

function choosePage(page){
	pages[page].className = 'page selected'
	pages.forEach((p, i) => {
		if (i != page) {
			p.className = 'page'
		}
	})
	var viewwidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
	container.scrollLeft = viewwidth*page
}

function highlightPage(page){
	pages[page].className = 'page selected'
	pages.forEach((p, i) => {
		if (i != page) {
			p.className = 'page'
		}
	})
	var viewwidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
	// container.scrollLeft = viewwidth*page
}

container.onscroll = () => {
	var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
	var scrollPercentage = container.scrollLeft/vw*100
	// console.log(scrollPercentage)
	selector.style.left = scrollPercentage/pages.length + '%'
	if (Math.floor(scrollPercentage) == 0) {
		highlightPage(0)
	}
	if (Math.floor(scrollPercentage) == 100) {
		highlightPage(1)
	}
	if (Math.floor(scrollPercentage) == 200) {
		highlightPage(2)
	}
}

window.onresize = initializePages