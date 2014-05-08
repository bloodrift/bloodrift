#pragma strict

//these are tubes and its prefabs

var TU_0 : GameObject;
var TU_1 : GameObject;
static var vesselMap = new Map();

var cam : GameObject;
var curVess = 0;
var curPos : float = 0;
var curSpeed : float = 10;

function Start(){
	// initialize models in real scene
	var vess : Vessel;
	var instance : GameObject;
	for (var i = 0; i < vesselMap.map.length; ++i){
		vess = vesselMap.map[i];
		switch (vess.vessType){
			case 0:
				instance = Instantiate(TU_0, vess.startPoint, vess.quaRotation);
				break;
			case 1:
				instance = Instantiate(TU_1, vess.startPoint, vess.quaRotation);
				break;
		}
	}
	cam.transform.position = Vector3.zero;
	cam.transform.rotation = Quaternion.AngleAxis(-90, Vector3(1, 0, 0));
}


function Update(){
	var vess : Vessel = vesselMap.map[curVess];
	curPos = vess.NextCentPos(curPos, curSpeed, Time.deltaTime);
//	Debug.Log(curPos);
	if (curPos > vess.vessLength){
		curPos -= vess.vessLength;
		curVess += 1;
		if(curVess >= vesselMap.map.length){
			curVess = 0;
		}
		vess = vesselMap.map[curVess];
	}
	transform.position = vess.CentPos2RealPos(curPos);
	var lookat = vess.CentPos2ForwardDir(curPos);
	transform.LookAt(transform.position + lookat, vess.GetUpDir(curPos, 0));
}

public class Map{
	public var map : Array; 
	public var lastPoint : Vector3;
	public var lastRotation : Quaternion;
	
	public function Map(){
		map = new Array();
		lastPoint = Vector3.zero;
		lastRotation = Quaternion(0, 0, 0, 1);
		//now it's only a randon map
		AddVessel(0);
		AddVessel(1);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(1);
		AddVessel(0);
		AddVessel(0);
		AddVessel(1);
		AddVessel(1);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(1);
		AddVessel(1);
		AddVessel(0);
	}
	
	public function AddVessel(type: int){
		var vess : Vessel;
		switch (type){
			case 0 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1);
				vess.SetProperty(2, 1);
				break;
			case 1 :
				vess = new Vessel(type, lastPoint, 0, lastRotation, 1);
				vess.SetProperty(2, 60);
				break;
			default :
				break;
		}
		map.Push(vess);
		lastPoint = vess.endPoint;
		lastRotation = vess.endRotation;
	}
	
}

public class Vessel{
	public var vessType : int;  // 0 for straight tube , 1 for bend tube
	public var startPoint : Vector3;
	public var modRotation : float;
	public var quaRotation : Quaternion;
	public var radius : float;
	
	
	// these are properties of straight tube
	public var vessLength : float;
	public var endRadius : float; // radius changed rate  = delta radius/tu
	
	// these are properties of bend tube
	public var rotateRadius : float;
	public var rotateAngle : float;
	
	//these are properties to be calculated
	public var endPoint : Vector3;
	public var endRotation : Quaternion;
	
	public function Vessel(type : int, sp : Vector3, mr : float, qr : Quaternion, r : float){
		vessType = type;
		startPoint = sp;
		modRotation = mr;
		quaRotation = qr;
		radius = r;
	}
	
	public function SetProperty(a : float, b : float){
		if(vessType % 2 == 0){
			vessLength = a;
			endRadius = b;
			endPoint = startPoint + Vector3(0, vessLength, 0);
			endPoint = quaRotation * (endPoint - startPoint) + startPoint;
			endRotation = quaRotation;
		}
		else {
			rotateRadius = a;
			rotateAngle = b; 
			var rots = rotateAngle * Mathf.PI / 180.0;
			vessLength = rots * rotateRadius;
			endPoint = startPoint + Vector3(0, rotateRadius * Mathf.Sin(rots), rotateRadius * (1 - Mathf.Cos(rots)));			
			var q : Quaternion;
			var p : Quaternion;
			q = Quaternion.AngleAxis(modRotation, Vector3.up);
			p = Quaternion.AngleAxis(rotateAngle, Vector3(1, 0, 0));
			endPoint = quaRotation * q * (endPoint - startPoint) + startPoint;
			endRotation = p * q * quaRotation;
		}
	}
	
	public function NextCentPos(prePos : float, speed : float, time : float) : float{
		return prePos + speed * time;
	}
	
	public function CentPos2RealPos(centPos : float) : Vector3{
		var pos : Vector3;
		if(vessType % 2 == 0){
			pos = (endPoint - startPoint) * (centPos / vessLength) + startPoint;
		}
		else{
			var rots  = centPos / rotateRadius;
			Debug.Log(rots);
			pos = startPoint + Vector3(0, rotateRadius * Mathf.Sin(rots), rotateRadius * (1 - Mathf.Cos(rots)));		
			pos = quaRotation * Quaternion.AngleAxis(modRotation, Vector3.up) * (pos - startPoint) + startPoint;
		}
		return pos;
	}
	
	public function CentPos2ForwardDir(centPos : float) : Vector3{
		var dir : Vector3;
		if(vessType % 2 == 0){
			dir = (endPoint - startPoint).normalized;
		}
		else{
			var angle = centPos / rotateRadius * 180 / Mathf.PI;
			var q = Quaternion.AngleAxis(modRotation, Vector3.up) * Quaternion.AngleAxis(angle, Vector3(1, 0, 0));
			dir = (quaRotation * q * Vector3.up).normalized;
		}
		return dir;
	}
	
	public function GetUpDir(centPos : float, rotAngle : float) : Vector3{
		var dir : Vector3 = Vector3(1, 0, 0);
		if(vessType % 2 == 0){
			dir = (quaRotation * Quaternion.AngleAxis(rotAngle, Vector3.up) * dir).normalized;
		}
		else{
			var angle = centPos / rotateRadius * 180 / Mathf.PI;
			var q = Quaternion.AngleAxis(modRotation, Vector3.up) * Quaternion.AngleAxis(angle, Vector3(1, 0, 0));
			dir = (quaRotation * Quaternion.AngleAxis(rotAngle, Vector3.up) * q * dir).normalized;
		}
		return dir;
	}
};