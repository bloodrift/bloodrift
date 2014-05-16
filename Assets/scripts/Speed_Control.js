#pragma strict

var MAX_MOVE_SPEED = 3;
var MIN_MOVE_SPEED = 0;

var moveSpeed = 1; 		// m/s
var acceleration = 1; 	//m/s2
var brakeAcceleration = 2;

function Update () {
	
	if(Input.GetKey(KeyCode.W)){
		if( moveSpeed < MAX_MOVE_SPEED ){
			moveSpeed += acceleration;
		}
	}
	if(Input.GetKey(KeyCode.S)){	
		if( moveSpeed > MIN_MOVE_SPEED ){
			moveSpeed -= brakeAcceleration;
		}
	}

}