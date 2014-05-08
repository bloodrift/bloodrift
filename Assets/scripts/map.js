#pragma strict

//these are tubes and its prefabs

var TU_0 : GameObject;
var TU_1 : GameObject;
static var vesselMap = new Map();

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
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
		AddVessel(0);
//		AddVessel(0);
//		AddVessel(1);
//		AddVessel(0);
//		AddVessel(0);
//		AddVessel(0);
//		AddVessel(1);
//		AddVessel(0);
//		AddVessel(0);
//		AddVessel(1);
//		AddVessel(1);
//		AddVessel(0);
//		AddVessel(0);
//		AddVessel(0);
//		AddVessel(0);
//		AddVessel(0);
//		AddVessel(1);
//		AddVessel(1);
//		AddVessel(0);

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
			Debug.Log(endPoint);
			endRotation = quaRotation;
		}
		else {
			rotateRadius = a;
			rotateAngle = b;
			var rots = rotateAngle * Mathf.PI / 180.0;
			endPoint = startPoint + Vector3(0, rotateRadius * Mathf.Sin(rots), rotateRadius * (1 - Mathf.Cos(rots)));			
			var q : Quaternion;
			var p : Quaternion;
			q = Quaternion.AngleAxis(modRotation, Vector3.up);
			p = Quaternion.AngleAxis(rotateAngle, Vector3(1, 0, 0));
			endPoint = quaRotation * q * (endPoint - startPoint) + startPoint;
			endRotation = p * q * quaRotation;
		}
	}
	
	public function OutOfRange(pos : Vector3){
		if(vessType % 2 == 0){
				
		}
		else {
		}
	}
};