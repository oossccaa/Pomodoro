// chrome.browserAction.setBadgeText({text:'123'})
// chrome.browserAction.setBadgeBackgroundColor({color:'#ff1102'})

//Pomodoro class，
const ALARM_NAME = 'pomodoro'

class Pomodoro {
    constructor() {
        //每次工作時間
        this.workTime = 5
        //完成工作次數
        this.workNum = 0
        //每次小休息時間
        this.restTime = 5
        //每次大休息時間
        this.bigRestTime = 8
        //休息次數
        this.restNum = 0
        //時間類型
        this.timer = 'work' // 'work' or 'rest'
        //現在時間
        this.time = 5
        //是否正在執行
        this.isRun = false
        //預設工作色系
        chrome.browserAction.setBadgeBackgroundColor({ color: '#4285f4' })
        //當點擊icon時觸發事件
        chrome.browserAction.onClicked.addListener(() => {
            this.handleIconClick()
        })
        chrome.browserAction.setBadgeText({ text: '-' })
        //當時鐘運轉時呼叫事件
        chrome.alarms.onAlarm.addListener(() => {
            this.handleAlarm()
        })
    }

    //點擊事件
    handleIconClick() {
        //正在執行就暫停
        if (this.isRun) {
            this.stop()
        }
        //開始
        else {
            this.start()
        }
        this.isRun = !this.isRun
    }
    //時鐘事件
    handleAlarm() {
        this.time--
        if (this.time < 1) {
            this.stop()
            //開啟休息/工作頁面
            chrome.runtime.openOptionsPage()
        } else {
            chrome.browserAction.setBadgeText({text: String(this.time) + 'min'})
        }
    }

    //切換時鐘
    switchAlarm() {
        if (this.timer === 'work') {
            //切換到休息模式
            chrome.browserAction.setBadgeBackgroundColor({ color: '#6e6e6e' })
            this.workNum++
            this.timer = 'rest'
            if (this.workNum === 4) {
                this.time = this.bigRestTime
            } else {
                this.time = this.restTime
            }
            this.start()
        } else {
            chrome.browserAction.setBadgeBackgroundColor({ color: '#4285f4' })
            this.restNum++
            if (this.restNum === 4) {
                //完成蕃茄鐘並歸零
                this.workNum = 0
                this.restNum = 0
                this.time = this.workTime
            } else {
                //切換到工作模式
                this.timer = 'work'
                this.time = this.workTime
            }
            this.start()
        }
    }

    //開始時鐘
    start() {
        chrome.alarms.create(ALARM_NAME, {
            delayInMinutes: 1,
            periodInMinutes: 1
        })
        chrome.browserAction.setBadgeText({text: String(this.time) + 'min'})
    }
    //暫停時鐘
    stop() {
        this.isRun = false
        chrome.browserAction.setBadgeText({ text: '-' })
        chrome.alarms.clear(ALARM_NAME)
    }

    //接收 option page 來的資訊
    onMessage(request) {
        if (request.func === 'getTimeInfo') {
            return {
                func: request.func,
                timeType: this.timer,
                restNum: this.restNum,
                workNum: this.workNum
            }
        } else if (request.func === 'switchAlarm') {
            this.switchAlarm()
        }
    }
}

var pomodoro = new Pomodoro()

chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === 'pomodoro') {
        port.onMessage.addListener(function(request) {
            port.postMessage(pomodoro.onMessage(request))
        })
    }
})
