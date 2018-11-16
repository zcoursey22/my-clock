let lightTimeout;
let alarmRinging = false;
let snoozing = false;
let alarm = {
  hour: null,
  minute: null,
  meridiem: null,
  valid: true
};
let second = new Date().getSeconds();
const alarmSound = new Audio('alarm.mp3');

function setTime() {
  const date = new Date();
  document.querySelector('#hour').innerHTML = formatHour(date);
  document.querySelector('#minute').innerHTML = formatMinute(date);
  document.querySelector('#second').innerHTML = formatSecond(date);
  document.querySelector('#meridiem').innerHTML = formatMeridiem(date);
  document.querySelector('#day').innerHTML = formatDate(date);
  newSecond = date.getSeconds();
  toggleColon(newSecond);
  second = newSecond;
  if (!alarm.valid && (alarm.hour !== formatHour(date) || alarm.minute !== formatMinute(date) || alarm.meridiem !== formatMeridiem(date))) {
    alarm.valid = true;
  }
  checkAlarm(date);
}

function formatHour(date) {
  let hour = date.getHours() > 12 ? (date.getHours() - 12).toString() : date.getHours().toString();
  hour = hour < 10 ? '0' + hour : hour;
  if (hour === '00') hour = '12';
  return hour;
}

function formatMinute(date) {
  return date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString();
}

function formatSecond(date) {
  return date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
}

function formatMeridiem(date) {
  return date.getHours() > 11 ? 'PM' : 'AM';
}

function formatDate(date) {
  const days = {
    '1': 'MON',
    '2': 'TUE',
    '3': 'WED',
    '4': 'THU',
    '5': 'FRI',
    '6': 'SAT',
    '7': 'SUN'
  }

  function formatMonth(date) {
    return date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  }

  function formatDay(date) {
    return date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  }

  let weekDay = days[date.getDay()];
  let monthDay = `${formatMonth(date)}/${formatDay(date)}`;
  return `${weekDay} ${monthDay}`;
}

function lightUp(duration, causedByAlarm) {
  const snoozeButtonClick = new Audio('alarmButtonClick.mp3');
  snoozeButtonClick.volume = 0.15;
  snoozeButtonClick.play();
  clearTimeout(lightTimeout);
  document.querySelector("#screen").style.backgroundColor = '#2f5aff';
  document.querySelector("#screen").style.borderColor = '#8499df';
  document.querySelector("#screen").style.boxShadow = '0 0 200px 50px rgba(47,90,255,0.5)';
  document.querySelector("#screen").style.zIndex = 10;
  lightTimeout = setTimeout(() => {
    document.querySelector("#screen").style.backgroundColor = '#aaba95';
    document.querySelector("#screen").style.borderColor = '#aaa';
    document.querySelector("#screen").style.boxShadow = 'inset 0 2px 10px 2px rgba(0,0,0,0.5)';
    document.querySelector("#screen").style.zIndex = 0;
  }, duration * 1000);
  if (alarmRinging && !causedByAlarm || snoozing) {
    snoozing = true;
    alarm.minute = Number(alarm.minute) + 5;
    if (alarm.minute > 59) {
      alarm.hour = Number(alarm.hour) + 1;
      alarm.minute = alarm.minute - 60;
      if (alarm.hour > 12) {
        alarm.hour = alarm.hour - 12;
        if (alarm.meridiem === 'AM') {
          alarm.meridiem = 'PM';
        } else {
          alarm.meridiem = 'AM';
        }
      }
    }
    alarm.hour = alarm.hour < 10 ? '0' + alarm.hour : alarm.hour.toString();
    alarm.minute = alarm.minute < 10 ? '0' + alarm.minute : alarm.minute.toString();
    clearTimeout(lightTimeout);
    setTimeout(() => {
      document.querySelector("#screen").style.backgroundColor = '#aaba95';
      document.querySelector("#screen").style.borderColor = '#aaa';
      document.querySelector("#screen").style.boxShadow = 'inset 0 2px 10px 2px rgba(0,0,0,0.5)';
      document.querySelector("#screen").style.zIndex = 0;
    }, 2500);
    alarmRinging = false;
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }
}

function setAlarm() {
  const alarmButtonClick = new Audio('alarmButtonClick.mp3');
  alarmButtonClick.volume = 0.25;
  alarmButtonClick.play();
  if (alarm.minute !== null) {
    alarm = {
      hour: null,
      minute: null,
      meridiem: null,
      valid: true
    }
    alarmRinging = false;
    alarmSound.pause();
    alarmSound.currentTime = 0;
    document.querySelector("#alarmIndicator").style.display = 'none';
    clearTimeout(lightTimeout);
    setTimeout(() => {
      document.querySelector("#screen").style.backgroundColor = '#aaba95';
      document.querySelector("#screen").style.borderColor = '#aaa';
      document.querySelector("#screen").style.boxShadow = 'inset 0 2px 10px 2px rgba(0,0,0,0.5)';
      document.querySelector("#screen").style.zIndex = 0;
    }, 2500);
  } else {
    alarm.hour = document.querySelector("#alarmHour").value;
    alarm.minute = document.querySelector("#alarmMinute").value;
    alarm.meridiem = document.querySelector("#alarmMeridiem").value;
    document.querySelector("#alarmTime").innerHTML = `${alarm.hour}<span id="alarmColon">:</span>${alarm.minute} ${alarm.meridiem}`;
    document.querySelector("#alarmIndicator").style.display = 'block';
    const date = new Date();
    if (alarm.hour === formatHour(date) && alarm.minute === formatMinute(date) & alarm.meridiem === formatMeridiem(date)) {
      alarm.valid = false;
    } else {
      alarm.valid = true;
    }
  }
}

function checkAlarm(date) {
  if (!alarmRinging && alarm.valid && alarm.hour === formatHour(date) && alarm.minute === formatMinute(date) && alarm.meridiem === formatMeridiem(date)) {
    alarmSound.volume = 0.5;
    alarmSound.loop
    alarmSound.play();
    lightUp(12.5, true);
    alarmRinging = true;
  }
}

function toggleColon(newSecond) {
  if (newSecond !== second) {
    if (document.querySelector("#timeColon").style.visibility === 'hidden') {
      document.querySelector("#timeColon").style.visibility = 'visible';
      document.querySelector("#alarmColon").style.visibility = 'hidden';
    } else {
      document.querySelector("#timeColon").style.visibility = 'hidden';
      document.querySelector("#alarmColon").style.visibility = 'visible';
    }
  }
}

function toggleLight() {
  const snoozeButtonClick = new Audio('lightSwitchSound.mp3');
  snoozeButtonClick.volume = 0.2;
  snoozeButtonClick.play();
  if (document.querySelector("#darkness").style.opacity === '0') {
    document.querySelector("#darkness").style.opacity = 0.8;
    document.querySelector("#panel").style.transform = 'scaleY(0.97) translateY(-3px)';
    document.querySelector("#panel").style.background = 'linear-gradient(to top, white, #ddd 20%, white 30%, #ddd 31%, white 60%)';
  } else {
    document.querySelector("#darkness").style.opacity = 0;
    document.querySelector("#panel").style.transform = 'scaleY(0.97) translateY(3px)';
    document.querySelector("#panel").style.background = 'linear-gradient(to bottom, white, #ddd 20%, white 30%, #ddd 31%, white 60%)';
  }
}


document.querySelector("#darkness").style.opacity = 0;
setTime();
window.setInterval(setTime, 100);
for (let i = 1; i < 60; i++) {
  var option = document.createElement("option");
  option.value = i < 10 ? '0' + i : i;
  option.innerHTML = i < 10 ? '0' + i : i;
  document.querySelector('#alarmMinute').appendChild(option);
}
