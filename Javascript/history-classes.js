class HistoryActivity{
	constructor(name, restRatio=3, identifier=makeid(10), hidden=false){
		this.name = name
		this.restRatio = restRatio
		this.identifier = identifier
		this.hidden = hidden
	}
	get duration(){
		var result = 0
		historySessions.forEach((s) => {
			if (s.activity == this) {
				result += round(s.duration)
			}
		})
		return result
	}
	get breakEarned(){
		var result = 0
		historySessions.forEach((s) => {
			if (s.activity == this) {
				result += round(s.breakEarned)
			}
		})
		return result
	}
	get activityElement(){
		var result = document.createElement('div')
		result.className = 'history-activity'
			result.innerHTML = `
			<div class="history-activity-name">${this.name}</div>
			<div class="history-activity-time"  id="history-activity-${this.identifier}-time">${getTimeDurationString(this.duration)}</div>`			
		return result
	}
}

class HistorySession{
	constructor(activity, start= new Date(), end='now', identifier='', description='', restRatio=0){
		this.activity = activity
		this.start = start
		this.end = end
		this.identifier = identifier || this.activity.identifier + getTimeString24h(this.start) + makeid(5)
		this.restRatio = restRatio || this.activity.restRatio
		this.description = description
	}
	attachDeleteButton(){
		document.getElementById(`history-session-${this.identifier}-delete`).onclick = () => {
			historySessions.forEach((s, i) => {
				if (s.identifier == this.identifier) {
					// document.getElementById(`session-${this.identifier}`).className = "session"
					if (this.end == 'now') {
						s.activity.active = false
					}
					historySessions.splice(i, 1)
					renderHistorySessions()
					renderHistoryActivities()
				}
			})
		}
		document.getElementById(`history-session-${this.identifier}-initiate-delete`).onclick = () => {
			document.getElementById(`history-session-${this.identifier}-delete-dialogue`).style.left = 0
		}
		document.getElementById(`history-session-${this.identifier}-cancel-delete`).onclick = () => {
			document.getElementById(`history-session-${this.identifier}-delete-dialogue`).style.left = "100%"
		}
	}
	attachEditButton(){
		document.getElementById(`history-session-${this.identifier}-edit`).onclick = () => {
			showMiddleWindow(
				`<div class="window-item">
					<div class="input-label">Start time:</div>
					<input id="history-session-${this.identifier}-start-field" class="window-text-input" type="time" value="${getTimeString24h(this.start)}">
				</div>
				<div class="window-item">
					<div class="input-label">End time:</div>
					<input id="history-session-${this.identifier}-end-field" class="window-text-input" type="time" value="${this.end == 'now' ? '' : getTimeString24h(this.end)}">
				</div>
				<div class="window-item">
					<div class="input-label">Description:</div>
					<textarea id="history-session-${this.identifier}-description-edit" class="window-text-input" rows="4">${this.description}</textarea>
				</div>
				<div class="mwrb">
					<button id="history-session-${this.identifier}-edit-cancel" class="text-button window-button">Cancel</button>
					<button id="history-session-${this.identifier}-edit-confirm" class="text-button window-button hover-blue">Apply</button>
				</div>`)
			document.getElementById(`history-session-${this.identifier}-edit-confirm`).onclick = () => {
				var newStart = document.getElementById(`history-session-${this.identifier}-start-field`).value
				var newEnd = document.getElementById(`history-session-${this.identifier}-end-field`).value
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
					this.activity.active = false
				}
				this.description = document.getElementById(`history-session-${this.identifier}-description-edit`).value
				renderHistorySessions()
				renderHistoryActivities()
				hideMiddleWindow()
			}
			document.getElementById(`history-session-${this.identifier}-edit-cancel`).onclick = () => {
				hideMiddleWindow()
			}
		}
	}
	get sessionElement(){
		var result = document.createElement('div')
		result.id = `history-session-${this.identifier}`
		result.className = 'session'
		result.innerHTML = 
			`<div class="delete-dialogue" id="history-session-${this.identifier}-delete-dialogue">
				 <div>Delete this session?</div>
				 <div>
					<button id="history-session-${this.identifier}-delete" class="delete-confirm delete-option">Delete</button>
					 <button id="history-session-${this.identifier}-cancel-delete" class="delete-cancel delete-option">Cancel</button>
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
					<span class="extra-text">for &nbsp;</span><span id="history-session-${this.identifier}-duration" class="hover-b">${getTimeDurationString(this.duration)}</span>
				</div>
				<div class="session-controls">
					<button class="edit-session" id="history-session-${this.identifier}-edit"><img class="icon-s" src="assets/edit.svg"></button>
					<button class="delete-session" id="history-session-${this.identifier}-initiate-delete"><img class="icon-s" src="assets/delete.svg"></button>
				</div>
			</div>`
		return result
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
	get dateString(){
		return this.start.getFullYear() + '-' + this.start.getMonth() + '-' + this.start.getDate()
	}
	endSession(){
		this.end = new Date()
		this.activity.active = false
	}
	syncAllSessions(){
		storage.setItem(this.dateString, JSON.stringify(historySessions))
	}
}