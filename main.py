def goNavigate():
    global isStopped
    if WSJoyStick.Listen_Key(KEY.A):
        isStopped = False
    if WSJoyStick.Listen_Key(KEY.B):
        isStopped = True
steeringSpeed = 0
isStopped = False
basic.show_icon(IconNames.CHESSBOARD)
isStopped = True
straightSpeed = 40
maxSteeringSpeed = 50
steeringDeadzone = 20
radio.set_group(5)
WSJoyStick.joy_stick_init()

def on_forever():
    global steeringSpeed
    goNavigate()
    steeringSpeed = Math.map(input.acceleration(Dimension.X),
        -1023,
        1023,
        maxSteeringSpeed * -1,
        maxSteeringSpeed)
    steeringSpeed = Math.round(steeringSpeed)
    if steeringDeadzone < abs(steeringSpeed):
        radio.send_value("dir", steeringSpeed)
    elif isStopped:
        radio.send_value("fs", 0)
        basic.show_icon(IconNames.SMALL_SQUARE)
    else:
        radio.send_value("fs", straightSpeed)
        basic.show_icon(IconNames.TRIANGLE)
basic.forever(on_forever)
