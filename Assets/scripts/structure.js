#pragma strict

public class Tube{
	public var tubeType : int;  // 0 for straight tube , 1 for bend tube
	public var startPoint : Vector3;
	public var modRotation : float;
	public var quaRotation : Quaternion;
	public var radius : float;
	
	
	// these are properties of straight tube
	public var tubeLength : float;
	public var endRadius : float; // radius changed rate  = delta radius/tu
	
	// these are properties of bend tube
	public var rotateRadius : float;
	public var rotateAngle : float;
	
	//these are properties to be calculated
	public var endPoint : Vector3;
	public var endRotation : Quaternion;
	
	public function Tube(type : int, sp : Vector3, mr : float, qr : Quaternion, r : float){
		tubeType = type;
		startPoint = sp;
		modRotation = mr;
		quaRotation = qr;
		radius = r;
	}
	
	public function SetProperty(a : float, b : float){
		if(tubeType == 0){
			tubeLength = a;
			endRadius = b;
			endPoint = startPoint + Vector3(0, tubeLength, 0);
			endPoint = quaRotation * (endPoint - startPoint)   - startPoint;
			endRotation = quaRotation;
		}
		else {
			rotateRadius = a;
			rotateAngle = b;
			endPoint = startPoint + Vector3(0, radius * Mathf.Sin(rotateAngle), radius * (1 - Mathf.Cos(rotateAngle)));
			var q : Quaternion;
			var p : Quaternion;
			q.AngleAxis(modRotation, Vector3.up);
			endPoint = q * (endPoint - startPoint) - startPoint;
			p.AngleAxis(rotateAngle, Vector3(1, 0, 0));
			endRotation = q * p * quaRotation;
		}
	}
};