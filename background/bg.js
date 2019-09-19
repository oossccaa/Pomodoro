// chrome.browserAction.setBadgeText({text:'123'})
// chrome.browserAction.setBadgeBackgroundColor({color:'#ff1102'})


//Pomodoro class
const ALARM_NAME = "pomodoro";

class Pomodoro {
  constructor() {
    //每次工作時間
    this.workTime = 25;
    //每次小休息時間
    this.restTime = 5;
    //每次大休息時間
    this.bigRestTime = 15;
    //時間類型
    this.timer = "work"; // 'work' or 'rest'
    this.isRun = false;

    //當點擊icon時觸發事件
    chrome.browserAction.onClicked.addListener(()=>{this.handleIconClick()})
    chrome.browserAction.setBadgeText({ text: '-'})
    //當時鐘運轉時呼叫事件
    chrome.alarms.onAlarm.addListener(()=>{this.handleAlarm()})
  }

  //點擊事件
  handleIconClick() {
    //正在執行就停止
    if (this.isRun) {
      chrome.browserAction.setBadgeText({ text: '-' })
      this.stop()
    }
    //開始
    else {
      this.start()
    }
    this.isRun = !this.isRun;
  }

  //時鐘事件
  handleAlarm() {
    if(this.workTime - 1 < 1){
        this.stop()
    }
    if (this.timer === "work") {
      this.workTime--
      chrome.browserAction.setBadgeText({ text: String(this.workTime) })
    }
  }

  //開始時鐘
  start() {
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 1,
      periodInMinutes: 1
    });
    chrome.alarms.getAll(function(array){
        console.log(array);
    })
  }
  //暫停時鐘
  stop() {
    chrome.alarms.clear(ALARM_NAME)
  }

}

const pomodoro = new Pomodoro();
