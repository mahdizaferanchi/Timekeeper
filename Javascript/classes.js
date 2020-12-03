class Activity{
	constructor(name, restRatio=3, active=false, identifier=makeid(10), hidden=false){
		this.name = name
		this.restRatio = restRatio
		this.active = active
		this.identifier = identifier
		this.hidden = hidden
	}
	attachStartButton(){
		document.getElementById(`activity-${this.identifier}-start`).onclick = () => {
			//start button handler:
			if(this.active){
				sessions[sessions.length - 1].endSession()
				renderSessions()
				renderActivities()
			}else{
				stop()
				var createdSession = new Session(this)
				sessionsElement.prepend(createdSession.sessionElement)
				renderActivities()				
				sessions.push(createdSession)
				startInterval()
				setTimeout(() => {
					renderSessions()
				}, 410)
			}
		}
	}
	attachEditButton(){
		document.getElementById(`activity-${this.identifier}-edit`).onclick = () => {
			showMiddleWindow(
				`<div class="window-item">
					<div class="input-label">Activity:</div>
					<input id="activity-${this.identifier}-name-edit-field" class="window-text-input" type="text" value="${this.name}">
				</div>
				<div class="window-item">
					<div class="input-label">Break Ratio:</div>
					<input id="activity-${this.identifier}-restRatio-edit-field" class="window-text-input" type="number" value="${this.restRatio}">
				</div>
				<div class="checkbox-text window-item">
					<input id="activity-${this.identifier}-hidden" type="checkbox" class="checkbox" ${this.hidden ? 'checked' : ''}> Hide activity
				</div>
				<button id="activity-${this.identifier}-delete" class="text-button window-button hover-red">Delete</button>
				<div class="mwrb">
					<button id="activity-${this.identifier}-edit-cancel" class="text-button window-button">Cancel</button>
					<button id="activity-${this.identifier}-edit-confirm" class="text-button window-button hover-blue">Apply</button>
				</div>`)
			document.getElementById(`activity-${this.identifier}-edit-confirm`).onclick = () => {
				this.name = document.getElementById(`activity-${this.identifier}-name-edit-field`).value
				this.restRatio = parseInt(document.getElementById(`activity-${this.identifier}-restRatio-edit-field`).value)
				this.hidden = document.getElementById(`activity-${this.identifier}-hidden`).checked
				renderActivities()
				hideMiddleWindow()
			}
			document.getElementById(`activity-${this.identifier}-edit-cancel`).onclick = () => {
				hideMiddleWindow()
				startInterval()
			}
			this.attachDeleteButton()
		}
	}
	attachDeleteButton(){
		document.getElementById(`activity-${this.identifier}-delete`).onclick = () => {
			//delete button handler for activity:
			sessions = sessions.filter(s => s.activity != this)
			renderSessions()
			activities.forEach((a, i) => {
				if (a.identifier == this.identifier) {
					activities.splice(i, 1)
				}
			hideMiddleWindow()
			renderActivities()
			startInterval()
			})
		}
	}
	attachHideButton(){
		document.getElementById(`activity-${this.identifier}-hide`).onclick = () => {
			//hide button handler for activity:
			this.hidden = !this.hidden
			renderActivities()
		}
	}
	get duration(){
		var result = 0
		sessions.forEach((s) => {
			if (s.activity == this) {
				result += round(s.duration)
			}
		})
		return result
	}
	get breakEarned(){
		var result = 0
		sessions.forEach((s) => {
			if (s.activity == this) {
				result += round(s.breakEarned)
			}
		})
		return result
	}
	get activityElement(){
		var result = document.createElement('div')
		result.className = 'activity' + (this.active ? ' active': '')
		result.innerHTML = `
			${this.active ? '<div class="indicator"></div>': ''}
			<div class="activity-name">${this.name}</div>
			<div class="activity-time"  id="activity-${this.identifier}-time">${getTimeDurationString(this.duration)}</div>
			<button class="play" id="activity-${this.identifier}-start"><img class="icon" src=${this.active ? 'assets/pause.svg' : 'assets/play.svg'}></button>
			<button class="edit" id="activity-${this.identifier}-edit"><img class="icon" src="assets/more.svg"></button>`
		var behind = document.createElement('div')
		behind.className = 'activity behind' + (!this.active ? ' active': '')
		behind.innerHTML = ``
		behind.id = `activity-${this.identifier}-behind`
		// result.append(behind)			
		return result
	}
}

class Session{
	constructor(activity, start= new Date(), end='now', identifier='', description='', restRatio=0){
		this.activity = activity
		this.start = start
		this.end = end
		this.identifier = identifier || this.activity.identifier + getTimeString24h(this.start) + makeid(5)
		if (this.end == 'now') {
			this.activity.active = true
		}
		this.restRatio = restRatio || this.activity.restRatio
		this.description = description
	}
	attachDeleteButton(){
		document.getElementById(`session-${this.identifier}-delete`).onclick = () => {
			sessions.forEach((s, i) => {
				if (s.identifier == this.identifier) {
					document.getElementById(`session-${this.identifier}`).parentElement.className = "session-wrapper fade-out"
					setTimeout(() => {
						document.getElementById(`session-${this.identifier}`).parentElement.remove()
						if (this.end == 'now') {
							s.activity.active = false
						}
						sessions.splice(i, 1)
						renderSessions()
						renderActivities()
						startInterval()
					}, 410)
				}
			})
		}
		document.getElementById(`session-${this.identifier}-initiate-delete`).onclick = () => {
			document.getElementById(`session-${this.identifier}-delete-dialogue`).style.left = 0
		}
		document.getElementById(`session-${this.identifier}-cancel-delete`).onclick = () => {
			document.getElementById(`session-${this.identifier}-delete-dialogue`).style.left = "100%"
		}
	}


	attachEditButton(){
		document.getElementById(`session-${this.identifier}-edit`).onclick = () => {
			//session edit button handler:
			showMiddleWindow(
				`<div class="window-item">
					<div class="input-label">Start time:</div>
					<input id="session-${this.identifier}-start-field" class="window-text-input" type="time" value="${getTimeString24h(this.start)}">
				</div>
				<div class="window-item">
					<div class="input-label">End time:</div>
					<input id="session-${this.identifier}-end-field" class="window-text-input" type="time" value="${this.end == 'now' ? '' : getTimeString24h(this.end)}">
				</div>
				<div class="window-item">
					<div class="input-label">Description:</div>
					<textarea id="session-${this.identifier}-description-edit" class="window-text-input" rows="4">${this.description}</textarea>
				</div>
				<div class="mwrb">
					<button id="session-${this.identifier}-edit-cancel" class="text-button window-button">Cancel</button>
					<button id="session-${this.identifier}-edit-confirm" class="text-button window-button hover-blue">Apply</button>
				</div>`)
			document.getElementById(`session-${this.identifier}-edit-confirm`).onclick = () => {
				var newStart = document.getElementById(`session-${this.identifier}-start-field`).value
				var newEnd = document.getElementById(`session-${this.identifier}-end-field`).value
				newStart = getDateObject(newStart)
				if (!(this.start.getHours() == newStart.getHours() && this.start.getMinutes() == newStart.getMinutes())) {
					this.start = newStart
				}
				if (newEnd) {
					if (this.end == 'now') {
						this.start = newStart
						this.end = getDateObject(newEnd)
					}else{
						newEnd = getDateObject(newEnd)
						if (!(this.end.getHours() == newEnd.getHours() && this.end.getMinutes() == newEnd.getMinutes())) {
							this.end = newEnd
						}	
					}
					if (this == sessions[sessions.length - 1]) {
						this.activity.active = false
					}
				}
				this.description = document.getElementById(`session-${this.identifier}-description-edit`).value
				renderSessions()
				renderActivities()
				hideMiddleWindow()
				startInterval()
			}
			document.getElementById(`session-${this.identifier}-edit-cancel`).onclick = () => {
				hideMiddleWindow()
			}
		}
	}
	get sessionElement(){
		var el = document.createElement('div')
		el.className = 'session-wrapper slide-in'
		var result = document.createElement('div')
		result.id = `session-${this.identifier}`
		result.className = 'session'
		result.innerHTML = 
			`<div class="delete-dialogue" id="session-${this.identifier}-delete-dialogue">
				 <div>Delete this session?</div>
				 <div>
					<button id="session-${this.identifier}-delete" class="delete-confirm delete-option">Delete</button>
					 <button id="session-${this.identifier}-cancel-delete" class="delete-cancel delete-option">Cancel</button>
				</div>
			 </div>
			<div class="session-name">${this.activity.name}</div>
			<div class="session-details">
				<div class="session-fromto">
					<div class="align extra-text">
						from &nbsp;
					</div>
					<div class="align hover-b">
						${getTimeString12h(this.start)}
					</div>
					<div class="align extra-text">
						to &nbsp;
					</div>
					<div class="align hover-b">
						${getTimeString12h(this.end)}
					</div>
				</div>
				<div class="session-for">
					<span class="extra-text">for &nbsp;</span><span id="session-${this.identifier}-duration" class="hover-b">${getTimeDurationString(this.duration)}</span>
				</div>
				<div class="session-controls">
					<button class="edit-session" id="session-${this.identifier}-edit"><img class="icon-s" src="assets/edit.svg"></button>
					<button class="delete-session" id="session-${this.identifier}-initiate-delete"><img class="icon-s" src="assets/delete.svg"></button>
				</div>
			</div>`
		el.append(result)
		return el
	}
	get endTime(){
		if (this.end == 'now') {
			return new Date()
		}else{
			return this.end
		}
	}
	get duration(){
		return this.endTime.getTime() - this.start.getTime()
	}
	get breakEarned(){
		return this.duration*(1/this.restRatio)
	}
	endSession(){
		this.end = new Date()
		this.activity.active = false
	}
}