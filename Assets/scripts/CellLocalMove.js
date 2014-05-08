#pragma strict

enum MoveMode { Surf, Drift };  
var movemode:MoveMode = MoveMode.Surf;
var stored_local_pos = Vector3.zero;


var constrainRadius = 3; // enable transform only within a circle
var deltaRotAngle = 45;  // 45 degrees 
var rotAngle:float = 0;

var deltaShift = 5;  // 45 degrees 
var shift: Vector3 = Vector3.zero;


function getVesselRadius(){
	return 1;
}

function getPlayerPlaneFwdDir()
{
	return Vector3.forward;
}

function Update () {
	
	// the player plane move forword
	var _playerPlaneMoveDir: Vector3= getPlayerPlaneFwdDir();
	transform.parent.Translate(_playerPlaneMoveDir*Time.deltaTime);
	
	if( Input.GetKeyUp(KeyCode.Space) ){

		// to Drift  mode
		// todo: 
		if(movemode == MoveMode.Surf){
			movemode = MoveMode.Drift;
			
			stored_local_pos = transform.localPosition;
			transform.localPosition = Vector3.zero;
		}
		// to Surface  mode
		else{
			movemode = MoveMode.Surf;
			
			transform.localPosition = stored_local_pos;
	
		}
	}
	
	if(movemode == MoveMode.Surf){
	
		if(Input.GetKeyDown(KeyCode.A)){
			rotAngle = deltaRotAngle*Time.deltaTime;
		}
		if(Input.GetKeyDown(KeyCode.D)){
			rotAngle = -deltaRotAngle*Time.deltaTime;
		}
		if(Input.GetKeyUp(KeyCode.A) || Input.GetKeyUp(KeyCode.D)){
			rotAngle = 0;
		}
		transform.Rotate(Vector3.forward*rotAngle);
	}
	
	if(movemode == MoveMode.Drift){
	
	
		if(Input.GetKeyDown(KeyCode.W)){
			shift = Vector3.up*deltaShift*Time.deltaTime;
		}
		if(Input.GetKeyDown(KeyCode.S)){
			shift = Vector3.down*deltaShift*Time.deltaTime;
		}
		if(Input.GetKeyUp(KeyCode.W) || Input.GetKeyUp(KeyCode.S)){
			shift.y = 0;
		}
	
		if(Input.GetKeyDown(KeyCode.A)){
			shift = Vector3.left*deltaShift*Time.deltaTime;
		}
		if(Input.GetKeyDown(KeyCode.D)){
			shift = Vector3.right*deltaShift*Time.deltaTime;
		}
		if(Input.GetKeyUp(KeyCode.A) || Input.GetKeyUp(KeyCode.D)){
			shift.x = 0;
		}
		
		//var global_shift:Vector3 =  Quaternion.Inverse(transform.localRotation)*shift;
		var post_localpos = transform.localPosition + shift;
		//Debug.LogError("shift:"+shift);			
		//Debug.LogError("localshif:"+local_shift);
		
		var distanceToLocalCenter  
			= Vector3.Distance(Vector3.zero,post_localpos);
		if( distanceToLocalCenter < constrainRadius){
			transform.Translate(shift);
		}
//		else{
//			Debug.LogError("parent:"+transform.parent.position);
//			Debug.LogError("parent:"+post_localpos);
//			
//			Debug.LogError(distanceToLocalCenter);
//		}
	}
	//transform.Rotate(roll);
	
//	var displacement = transform.position - oldposition;
//	Debug.LogError(displacement);
//	var angle = Mathf.Atan2(displacement.y,displacement.x);
//	transform.Rotate(0,0,angle);
}