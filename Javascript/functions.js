function round(num){

	return Math.trunc(num/1000)*1000
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function showMiddleWindow(innerHTML){
	middleWindow.innerHTML = innerHTML
	grayScreenElement.style.opacity = 0.7
	grayScreenElement.style.zIndex = 1
	document.body.appendChild(middleWindow)
}

function hideMiddleWindow(){
	middleWindow.remove()
	grayScreenElement.style.opacity = 0
	setTimeout(() => {
		grayScreenElement.style.zIndex = -1
	}, 300)
}

function getDateObject(s){
	strings = s.split(':')
	var result = new Date()
	result.setHours(Number(strings[0]))
	result.setMinutes(Number(strings[1]))
	result.setSeconds(0)
	if (strings.length == 3) {
		result.setSeconds(Number(strings[2]))
	}
	return result
}

function getTimeDurationString(t){
	var hours = (t>=0) ? Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : Math.ceil((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  	var minutes = (t>=0) ? Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)) : Math.ceil((t % (1000 * 60 * 60)) / (1000 * 60));
 	var seconds = Math.floor((t % (1000 * 60)) / 1000);
 	return  hours + "h " + minutes + "m " + seconds + "s ";
}

function getTimeString12h(t){
	if (t == 'now') {
		return '...'
	}else{
		if (t.getHours() > 12) {
			return t.getHours() - 12 + ':' + (t.getMinutes()<10?'0':'') + t.getMinutes() + " PM"
		}else{
			return t.getHours() + ':' + (t.getMinutes()<10?'0':'') + t.getMinutes() + " AM"
		}
	}
}

function getTimeString24h(t){
	if (t == 'now') {
		return ''
	}else{
		return t.getHours().toString().padStart(2, '0') + ':' + (t.getMinutes()<10?'0':'') + t.getMinutes()
	}
}


function appendHistoryActivity(activity){
	if (!activity.hidden || showHiddenActivities){
		historyActivitiesElement.appendChild(activity.activityElement)
		// activity.attachHideButton()
	}
}

function appendHistorySession(session){
	historySessionsElement.appendChild(session.sessionElement)
	session.attachDeleteButton()
	session.attachEditButton()
}

function renderActivities(){
	if (activities.length == 0) {
		activitiesElement.innerHTML = `<div class="no-content">
			You have not created any activities yet. Press the '+' button to create an activity.
			</div>`
		return;
	}
	var activitiesElementVirtual = activitiesElement.cloneNode()
	activitiesElementVirtual.append(breakElement())
	activities.forEach((a) => {
		if (!a.hidden || showHiddenActivities){
			activitiesElementVirtual.appendChild(a.activityElement)
		}
	})
	morphdom(activitiesElement, activitiesElementVirtual)
	//attach buttons
	activities.forEach((a) =>{
		if (!a.hidden || showHiddenActivities){	
			a.attachStartButton()
			a.attachEditButton()
		}
	})
	attachBreakButton()
}

function getTextWidth(text) {
	var test = continueButton
	test.innerHTML = text;
    return (test.clientWidth + 1);
}

function renderGeneralButtons(){
	var sessionsf = sessions.filter(s => s.activity != _break_)
	if (sessionsf.length) {
		var target = sessionsf[sessionsf.length - 1].activity.name
		root.style.setProperty('--eb-left-width', (getTextWidth(target) + 40) + 'px')
		continueButton.innerHTML = target
		if (_break_.active) {
			document.getElementById('break-button-text').innerHTML = 'End Break'
		}else{
			document.getElementById('break-button-text').innerHTML = 'Start Break'
		}
		if (sessionsf[sessionsf.length - 1].activity.active) {
			document.getElementById("general-start").firstChild.firstChild.src = "assets/pause.svg"
		}else{
			document.getElementById("general-start").firstChild.firstChild.src = "assets/play.svg"
		}
	}else{
		if (activities[0]) {
			var target = activities[0].name
			root.style.setProperty('--eb-left-width', (getTextWidth(target) + 40) + 'px')
			document.getElementById("general-start").getElementsByTagName('div')[0].innerHTML = target
			document.getElementById("general-start").firstChild.firstChild.src = "assets/play.svg"
		}
	}

}

function renderSessions(){
	if (sessions.length == 0) {
		sessionsElement.innerHTML = `<div class="no-content">
			No sessions have been created today. Press the play button of one of your activities to start a session.
			</div>`
		renderGeneralButtons()
		return;
	}
	var sessionsElementVirtual = sessionsElement.cloneNode()
	sessionsElementVirtual.innerHTML = ''
	sessions.forEach((s) => {
		sessionsElementVirtual.prepend(s.sessionElement)
	})
	morphdom(sessionsElement, sessionsElementVirtual)
	//attach buttons
	sessions.forEach((s) => {
		s.attachDeleteButton()
		s.attachEditButton()
	})
	renderGeneralButtons()
}

// function renderSessions(){
// 	sessionsElement.innerHTML = ''
// 	sessions.forEach((s) => {
// 		appendSession(s)
// 	})
// }

// function appendSession(session){
// 	sessionsElement.prepend(session.sessionElement)
// 	session.attachDeleteButton()
// 	session.attachEditButton()
// }

function renderHistorySessions(){
	historySessionsElement.innerHTML = ''
	historySessions.forEach((s) => {
		appendHistorySession(s)
	})
	historySessions[0].syncAllSessions()
}

function renderHistoryActivities(){
	historyActivitiesElement.innerHTML = ''
	var totalDuration = 0
	historyActivities.forEach((a) => {
		if (!a.duration == 0) {
			appendHistoryActivity(a)
			totalDuration += a.duration
		}
	})
	var result = document.createElement('div')
	result.className = 'history-activity'
		result.innerHTML = `
		<div class="history-activity-name">Total</div>
		<div class="history-activity-time">${getTimeDurationString(totalDuration)}</div>`
	historyActivitiesElement.appendChild(result)		

}

function refreshTimers(){
	activities.forEach((a) => {
		if (!a.hidden) {
			document.getElementById(`activity-${a.identifier}-time`).innerHTML = getTimeDurationString(a.duration)
		}
	})
	sessions.forEach((s) => {
		document.getElementById(`session-${s.identifier}-duration`).innerHTML = getTimeDurationString(s.duration)
	})
	totalTime = 0
	totalBreak = 0
	activities.forEach((a) => {
		totalTime += round(a.duration)
		totalBreak += round(a.breakEarned)
	})
	totalBreak = totalBreak - round(_break_.duration)
	totalBreak = round(totalBreak)
	totalTimeElement.innerHTML = getTimeDurationString(totalTime)
	document.getElementById('total-break').innerHTML = getTimeDurationString(totalBreak)
	// document.getElementById('break-time').innerHTML = getTimeDurationString(totalBreak)
	var newState = 'SAFE'
	if (totalBreak < 1000*60 && _break_.active) {
		newState = 'WARNNING'
	}
	if (totalBreak < 0) {
		newState = 'DANGER'
	}
	if (state != newState) {
		if (newState == 'DANGER') {
			root.style.setProperty('--break-text-color', 'red')
		}
		if (newState == 'WARNNING') {
			root.style.setProperty('--break-text-color', 'orange')
		}
		if (newState == 'SAFE') {
			root.style.setProperty('--break-text-color', 'black')
		}
		state = newState
	}
}

function initializeActivities(){
	var response = JSON.parse(storage.getItem('activities')) || []
	// response = []
	response.forEach((a) => {
		activities.push(new Activity(a.name, a.restRatio, a.active, a.identifier, a.hidden))
		historyActivities.push(new HistoryActivity(a.name, a.restRatio, a.identifier))
	})
	renderActivities()
}

function initializeSessions(){
	var response = JSON.parse(storage.getItem(todayString)) || []
	// response = []
	response.forEach((s) => {
		var correctActivity = activities.find(a => a.identifier == s.activity.identifier)
		if (s.activity.identifier == '1') {
			correctActivity = _break_
		}
		var correctStart = new Date(Date.parse(s.start))
		var correctEnd = s.end == 'now' ? 'now' : new Date(Date.parse(s.end))
		sessions.push(new Session(correctActivity, correctStart, correctEnd, s.identifier, s.description, s.restRatio))
	})
	renderSessions()
	renderActivities()
}

function initializeHistorySessions(date=yesterdayDateString){
	var response = JSON.parse(storage.getItem(date)) || []
	historySessions = []
	response.forEach((s, i) => {
		var correctActivity = activities.find(a => a.identifier == s.activity.identifier)
		var correctHistoryActivity = historyActivities.find(a => a.identifier == s.activity.identifier)
		if (s.activity.identifier == '1') {
			correctActivity = _break_
			correctHistoryActivity = _break_
		}
		var correctStart = new Date(Date.parse(s.start))
		var correctEnd = s.end == 'now' ? 'now' : new Date(Date.parse(s.end))
		if (correctActivity) {
			historySessions.push(new HistorySession(correctHistoryActivity, correctStart, correctEnd, s.identifier, s.description, s.restRatio))
		}
	})
	renderHistorySessions()
	renderHistoryActivities()
}


function syncActivities(){

	storage.setItem('activities', JSON.stringify(activities))
}

function syncSessions(){

	storage.setItem(todayString, JSON.stringify(sessions))
}

function stop(){
	if(sessions.length){
		if (sessions[sessions.length - 1].end == 'now') {
			sessions[sessions.length - 1].endSession()
		}
	}
}

function breakElement(){
	var result = document.createElement('div')
	result.className = 'activity' + (_break_.active ? ' bactive': '')
	result.id = 'break'
	result.innerHTML = 
		`<div id="break-text">Break</div>
		<button id="break-start" class="play"><img class="icon" src=assets/stop.svg></button>`	
	return result
}

function attachBreakButton(){
	document.getElementById(`break-start`).onclick = () => {
		//break start button handler:
		if(_break_.active){
			sessions[sessions.length - 1].endSession()
			renderSessions()
			renderActivities()
		}else{
			stop()
			var createdSession = new Session(_break_)
			sessionsElement.prepend(createdSession.sessionElement)
			renderActivities()				
			setTimeout(() => {
				startInterval()
				sessions.push(createdSession)
				renderSessions()
			}, 410)			
		}
	}
}

// function renderActivities(){
// 	document.getElementById('break').remove()
// 	activitiesElement.innerHTML = ''
// 	activitiesElement.append(breakElement())
// 	attachBreakButton()
// 	activities.forEach((a) => {
// 		appendActivity(a)
// 	})
// }

// function appendActivity(activity){
// 	if (!activity.hidden || showHiddenActivities){
// 		activitiesElement.appendChild(activity.activityElement)
// 		activity.attachStartButton()
// 		activity.attachEditButton()
// 		// activity.attachHideButton()
// 	}
// }
