function translateInstruction (instruction: number) {
    if (instruction == 0) {
        radio.sendValue("fs", 0)
    } else if (instruction == 1) {
        radio.sendValue("fs", 40)
    } else if (instruction == 2) {
        radio.sendValue("fs", -1 * 40)
    } else if (instruction == 3) {
        radio.sendValue("dir", -1 * 40)
    } else {
        radio.sendValue("dir", 40)
    }
}
WSJoyStick.onKey(KEY.C, function () {
    steeringMode = !(steeringMode)
})
let steeringSpeed = 0
let isRecording = false
let instruction = 0
let lista: number[] = []
let playIndex = 0
let isPlaying = false
let steeringMode = false
basic.showIcon(IconNames.Diamond)
steeringMode = false
let isStopped = true
let straightSpeed = 30
let maxSteeringSpeed = 50
let steeringDeadzone = 20
radio.setGroup(31)
WSJoyStick.JoyStickInit()
basic.forever(function () {
    if (!(steeringMode)) {
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
            translateInstruction(instruction)
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
    }
})
basic.forever(function () {
    if (WSJoyStick.Listen_Dir(DIR.U)) {
        isStopped = false
    }
    if (WSJoyStick.Listen_Dir(DIR.D)) {
        isStopped = true
    }
})
basic.forever(function () {
    if (steeringMode) {
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
    }
})
