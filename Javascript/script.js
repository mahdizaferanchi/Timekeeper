var _break_ = new Activity('Break', 3, false, '1')
activitiesElement = document.getElementById('activities')
sessionsElement = document.getElementById('sessions')
historySessionsElement = document.getElementById('history-sessions')
historyActivitiesElement = document.getElementById('history-activities')
totalTimeElement = document.getElementById('total-time')
grayScreenElement = document.getElementById('gray-screen')

storage = window.localStorage

activities = []
sessions = []
historySessions = []
historyActivities = []

totalTime = 0
totalBreak = 0

todayDate = new Date()
yesterdayDate = new Date(todayDate.getTime() - 1000*60*60*24)
todayString = todayDate.getFullYear() + '-' + todayDate.getMonth() + '-' + todayDate.getDate()
yesterdayString = yesterdayDate.getFullYear() + '-' + (yesterdayDate.getMonth()+1).toString().padStart(2, '0') + '-' + yesterdayDate.getDate().toString().padStart(2, '0')
showHiddenActivities = false


middleWindow = document.createElement('div')
middleWindow.className = 'middle-window'
middleWindow.id = 'middle-window'
grayScreenElement.onclick = () => {
	hideMiddleWindow()
}
document.getElementById('add-activity').onclick = () => {
	showMiddleWindow(
		`<div class="window-item">
			<div class="input-label">Name:</div>
			<input id="activity-name-add-field" class="window-text-input" name="_title" type="text">
		</div>
		<div class="window-item">
			<div class="input-label">Break Ratio:</div>
			<input id="activity-restRatio-add-field" class="window-text-input" type="number" value="3">
		</div>
		<div class="mwrb">
			<button id="activity-add-cancel" class="text-button window-button">Cancel</button>
			<button id="activity-add-confirm" class="text-button window-button hover-blue">Add</button>
		</div>`)
	document.getElementById(`activity-add-confirm`).onclick = () => {
		var name = document.getElementById(`activity-name-add-field`).value
		var restRatio = parseInt(document.getElementById(`activity-restRatio-add-field`).value)
		activities.push(new Activity(name, restRatio))
		renderActivities()
		hideMiddleWindow()
	}
	document.getElementById(`activity-add-cancel`).onclick = () => {
		hideMiddleWindow()
	}
}

document.getElementById('change-hide-status').onclick = () => {
	showHiddenActivities = !showHiddenActivities
	document.getElementById('change-hide-status').innerHTML = showHiddenActivities ? `<img class="show-svg" src="assets/hide.svg">` : `<img class="show-svg" src="assets/show.svg">`
	renderActivities()
}
document.getElementById("general-start").onclick = () => {
	var sessionsf = sessions.filter(s => s.activity != _break_)
	if (sessionsf.length) {
		var target = `activity-${sessionsf[sessionsf.length - 1].activity.identifier}-start`
	}else{
		var target = `activity-${activities[0].identifier}-start`
	}
	document.getElementById(target).click()
}
document.getElementById(`general-break`).onclick = () => {
	document.getElementById(`break-start`).click()
}
document.getElementById('history-date').setAttribute('max', yesterdayString)
document.getElementById('history-date').onchange = (e) => {
		if (e.target.checkValidity()) {
			var fields = e.target.value.split('-')
			var dateString = [fields[0], String(Number(fields[1]) - 1), String(Number(fields[2]))].join('-')
			initializeHistorySessions(dateString)
		}else{
			console.log('Invalid Date')
		}
}

activitiesElement.append(breakElement())

initializeActivities()
initializeSessions()
renderGerenalButtons()
// initializeHistorySessions()

intervalRunning =  0 

function startInterval(){
	refreshTimers()
	clearInterval(intervalRunning)
	intervalRunning = setInterval(() => {
		refreshTimers()
	}, 1000)
}
startInterval()

document.addEventListener("visibilitychange", () => {
	if (intervalRunning && document.hidden) {
		clearInterval(intervalRunning)
		intervalRunning = 0
	}else{
		startInterval()
	}
});

window.onunload = () => {
	syncSessions()
	syncActivities()
}