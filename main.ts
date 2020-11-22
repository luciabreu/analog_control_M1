WSJoyStick.onKey(KEY.F, function () {
    if (!(steeringMode)) {
        if (isRecording) {
            pushToRecordingList(3)
        }
    }
})
function updateScreen () {
    if (steeringMode) {
        basic.showIcon(IconNames.Triangle)
    } else {
        if (isRecording) {
            basic.showIcon(IconNames.Target)
        } else if (isPlaying) {
            basic.showLeds(`
                . # . . .
                . # # . .
                . # # # .
                . # # . .
                . # . . .
                `)
        } else {
            basic.showIcon(IconNames.SmallSquare)
        }
    }
}
function pushToRecordingList (instruction: number) {
    if (instruction > 2) {
        recordingCyclesTemp = recordingCyclesTurning
    } else {
        recordingCyclesTemp = recordingCyclesForward
    }
    for (let index = 0; index < recordingCyclesTemp; index++) {
        recordingList.push(instruction)
    }
}
function translateInstruction (instruction: number) {
    if (lastSentInstruction != instruction) {
        if (instruction == 0) {
            radio.sendValue("fs", 0)
        } else if (instruction == 1) {
            radio.sendValue("fs", buttonForwardSpeed)
        } else if (instruction == 2) {
            radio.sendValue("fs", -1 * buttonForwardSpeed)
        } else if (instruction == 3) {
            radio.sendValue("dir", -1 * buttonSteeringSpeed)
        } else {
            radio.sendValue("dir", buttonSteeringSpeed)
        }
        lastSentInstruction = instruction
    }
}
WSJoyStick.onKey(KEY.A, function () {
    if (!(steeringMode)) {
        if (isRecording) {
            endRecording()
        } else {
            isRecording = true
            isPlaying = false
            recordingList = []
        }
        updateScreen()
    }
})
WSJoyStick.onKey(KEY.E, function () {
    if (!(steeringMode)) {
        if (isRecording) {
            pushToRecordingList(1)
        }
    }
})
function endRecording () {
    isRecording = false
    recordingList.push(0)
    recordingList.push(0)
    recordingList.push(0)
}
WSJoyStick.onKey(KEY.D, function () {
    if (!(steeringMode)) {
        if (isRecording) {
            pushToRecordingList(4)
        }
    }
})
WSJoyStick.onKey(KEY.B, function () {
    if (!(steeringMode)) {
        if (isPlaying) {
            isPlaying = false
        } else {
            endRecording()
            isPlaying = true
            playIndex = 0
        }
        updateScreen()
    }
})
WSJoyStick.onKey(KEY.C, function () {
    steeringMode = !(steeringMode)
    updateScreen()
})
let steeringSpeed = 0
let instruction = 0
let playIndex = 0
let lastSentInstruction = 0
let recordingList: number[] = []
let isPlaying = false
let isRecording = false
let steeringMode = false
let buttonSteeringSpeed = 0
let buttonForwardSpeed = 0
let recordingCyclesTemp = 0
let recordingCyclesTurning = 0
let recordingCyclesForward = 0
// These are for steering mode
let straightSpeed = 30
let maxSteeringSpeed = 50
let steeringDeadzone = 20
recordingCyclesForward = 50
recordingCyclesTurning = 30
recordingCyclesTemp = 0
buttonForwardSpeed = 35
buttonSteeringSpeed = 35
radio.setGroup(31)
WSJoyStick.JoyStickInit()
steeringMode = false
let isStopped = true
updateScreen()
basic.forever(function () {
    if (!(steeringMode)) {
        if (isPlaying) {
            if (playIndex >= recordingList.length) {
                isPlaying = false
                updateScreen()
            } else {
                instruction = recordingList[playIndex]
                playIndex += 1
                translateInstruction(instruction)
            }
        } else if (!(isRecording)) {
            if (WSJoyStick.Listen_Key(KEY.E)) {
                instruction = 1
            } else if (WSJoyStick.Listen_Key(KEY.F)) {
                instruction = 3
            } else if (WSJoyStick.Listen_Key(KEY.D)) {
                instruction = 4
            } else {
                instruction = 0
            }
            translateInstruction(instruction)
        }
    }
})
basic.forever(function () {
    if (WSJoyStick.Listen_Dir(DIR.U)) {
        isStopped = false
        updateScreen()
    }
    if (WSJoyStick.Listen_Dir(DIR.D)) {
        isStopped = true
        updateScreen()
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
        }
    }
})
