#pragma strict

var tubeType : int  = 0;
var dis : float = 0;
var rot : float = 0;
var tubeCenter : Vector3 = Vector3(0, 0, 0);
var tubea : GameObject;
var tubeb : GameObject;
var tube : GameObject;
var pi : float = 3.1415926;

function Start(){
	tube = tubea;
}

function Update(){
	if(tubeType == 0){
		if(dis < 2){
			tube.transform.Translate(Vector3.down * Time.deltaTime);
			tubeb.transform.Translate(Vector3.down * Time.deltaTime);
			dis += Time.deltaTime;
		}
		else {
		//	tube.transform.position = Vector3(-1.73, 1.5, 0);
		//	tube.transform.Rotate(0, 0, 60);
			rot = 0;
			tubeType = 1;
			tube = tubeb;
			tube.transform.position = Vector3(-2, -1, 0);
		//	tube.transform.rotation.SetEulerRotation(0, 0, 0);
		}
	}
	if(tubeType == 1){
		if(rot < 60){
			tube = tubeb;
			tube.transform.Rotate(0, 0, -30 * Time.deltaTime);
			tubea.transform.RotateAround(tube.transform.position, Vector3.back, 30 * Time.deltaTime); 
			rot += 30 * Time.deltaTime;
		}
		else {
			dis = 0;
			tubeType = 0;
			tube.transform.position = Vector3(-2, 1, 0);
			tube.transform.rotation.z = 0;
			tube = tubea;
			tube.transform.position = Vector3(0, 0, 0);
			
		}
	}
}