function goNavigate () {
    if (WSJoyStick.Listen_Dir(DIR.U)) {
        isStopped = false
    }
    if (WSJoyStick.Listen_Dir(DIR.D)) {
        isStopped = true
    }
}
function screenDirection (instruction: number) {
    if (instruction == 0) {
        radio.sendValue("fs", 0)
    } else if (instruction == 1) {
        radio.sendValue("fs", straightSpeed)
    } else if (instruction == 2) {
        radio.sendValue("fs", -1 * straightSpeed)
    } else if (instruction == 3) {
        radio.sendValue("dir", -1 * maxSteeringSpeed)
    } else {
        radio.sendValue("dir", maxSteeringSpeed)
    }
}
let steeringSpeed = 0
let isRecording = false
let instruction = 0
let lista: number[] = []
let playIndex = 0
let isPlaying = false
let maxSteeringSpeed = 0
let straightSpeed = 0
let isStopped = false
basic.showIcon(IconNames.Diamond)
isStopped = true
straightSpeed = 30
maxSteeringSpeed = 50
let steeringDeadzone = 20
radio.setGroup(31)
WSJoyStick.JoyStickInit()
basic.forever(function () {
    if (isPlaying) {
        if (playIndex >= lista.length) {
            isPlaying = false
        } else {
            instruction = lista[playIndex]
            playIndex += 1
        }
    } else {
        if (WSJoyStick.Listen_Key(KEY.E)) {
            instruction = 1
        } else if (WSJoyStick.Listen_Key(KEY.C)) {
            instruction = 2
        } else if (WSJoyStick.Listen_Key(KEY.F)) {
            instruction = 3
        } else if (WSJoyStick.Listen_Key(KEY.D)) {
            instruction = 4
        } else {
            instruction = 0
        }
    }
    if (isRecording) {
        lista.push(instruction)
    } else {
        screenDirection(instruction)
    }
    if (WSJoyStick.Listen_Key(KEY.A) && isRecording) {
        isRecording = false
    } else if (WSJoyStick.Listen_Key(KEY.A)) {
        isRecording = true
        isPlaying = false
        lista = []
    }
    if (WSJoyStick.Listen_Key(KEY.B) && isPlaying) {
        isPlaying = false
    } else if (WSJoyStick.Listen_Key(KEY.B)) {
        isPlaying = true
        playIndex = 0
        isRecording = false
    }
})
basic.forever(function () {
    goNavigate()
    steeringSpeed = Math.map(input.acceleration(Dimension.X), -1023, 1023, maxSteeringSpeed * -1, maxSteeringSpeed)
    steeringSpeed = Math.round(steeringSpeed)
    if (steeringDeadzone < Math.abs(steeringSpeed)) {
        radio.sendValue("dir", steeringSpeed)
    } else if (isStopped) {
        radio.sendValue("fs", 0)
    } else {
        radio.sendValue("fs", straightSpeed)
        basic.showIcon(IconNames.Triangle)
    }
})
