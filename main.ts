Kitronik_Game_Controller.onButtonPress(Kitronik_Game_Controller.ControllerButtonPins.Right, Kitronik_Game_Controller.ControllerButtonEvents.Click, function () {
    if (!(steeringMode)) {
        if (isRecording) {
            pushToRecordingList(4)
            talkDirection(4)
        }
    }
})
function updateScreen () {
    if (isRecording) {
        basic.showLeds(`
            . . . . .
            . # # # .
            . # . # .
            . # # # .
            . . . . .
            `)
    } else if (isPlaying) {
        basic.showLeds(`
            . # . . .
            . # # . .
            . # # # .
            . # # . .
            . # . . .
            `)
    } else {
        basic.showIcon(IconNames.Heart)
    }
}
Kitronik_Game_Controller.onButtonPress(Kitronik_Game_Controller.ControllerButtonPins.Up, Kitronik_Game_Controller.ControllerButtonEvents.Click, function () {
    if (!(steeringMode)) {
        if (isRecording) {
            pushToRecordingList(1)
            talkDirection(1)
        }
    }
})
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
Kitronik_Game_Controller.onButtonPress(Kitronik_Game_Controller.ControllerButtonPins.Down, Kitronik_Game_Controller.ControllerButtonEvents.Click, function () {
    steeringMode = !(steeringMode)
    updateScreen()
})
input.onButtonPressed(Button.A, function () {
    Kitronik_Game_Controller.runMotor(40)
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
function translateInstruction (instruction: number) {
    if (instruction == 0 || lastSentInstruction != instruction) {
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
function endRecording () {
    isRecording = false
    recordingList.push(0)
    recordingList.push(0)
    recordingList.push(0)
}
input.onButtonPressed(Button.B, function () {
    Kitronik_Game_Controller.runMotor(60)
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
Kitronik_Game_Controller.onButtonPress(Kitronik_Game_Controller.ControllerButtonPins.Left, Kitronik_Game_Controller.ControllerButtonEvents.Click, function () {
    if (!(steeringMode)) {
        if (isRecording) {
            pushToRecordingList(3)
            talkDirection(3)
        }
    }
})
function talkDirection (instruction: number) {
    if (instruction == 1) {
        radio.sendValue("robot", 1)
    } else if (instruction == 3) {
        radio.sendValue("robot", 2)
    } else if (instruction == 4) {
        radio.sendValue("robot", 3)
    }
}
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
            if (Kitronik_Game_Controller.buttonIsPressed(Kitronik_Game_Controller.ControllerButtonPins.Up)) {
                instruction = 1
            } else if (Kitronik_Game_Controller.buttonIsPressed(Kitronik_Game_Controller.ControllerButtonPins.Left)) {
                instruction = 3
            } else if (Kitronik_Game_Controller.buttonIsPressed(Kitronik_Game_Controller.ControllerButtonPins.Right)) {
                instruction = 4
            } else {
                instruction = 0
            }
            translateInstruction(instruction)
        }
    }
})
