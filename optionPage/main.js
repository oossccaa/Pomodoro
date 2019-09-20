//將按鈕綁定事件
var btns = document.getElementsByClassName('btn')
Array.prototype.map.call(btns,node=>{
    node.addEventListener('click',switchAlarm)
})

//與後台腳本建立一個長時間的連線
var port = chrome.runtime.connect({name:"pomodoro"})
//當請求回應時接收
port.onMessage.addListener(function(response){
    //如果是取得時間的回傳就控制畫面切換
    if(response && response.func && response.func === 'getTimeInfo'){
        //休息三次+這次鬧鐘也是休息代表完成番茄鐘
        if(response.timeType === 'rest' && response.restNum === 3){
            document.getElementById('success').style.display = 'block'
            document.getElementById('work').style.display = 'none'
            document.getElementById('rest').style.display = 'none'
        }else{
            document.getElementById(response.timeType === 'work' ? 'rest' : 'work').style.display = 'block'
            document.getElementById(response.timeType).style.display = 'none'
        }
    }
})

//發送請求-取得時鐘資訊
port.postMessage({func:'getTimeInfo'})

//向後台腳本要求切換時鐘並運行
function switchAlarm(){
    port.postMessage({func: 'switchAlarm'})
    window.close()
}
