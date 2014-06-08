#pragma strict
//---------------------------------------------------------------------------------------------------------
public class BloodItem{
	public var itemType : int;
	public var centPos : int;
	public var radius : float;
	public var position : Vector3;
	public var rotation : Quaternion;
	public var instance : GameObject;
	
	public function BloodItem(type : int, r : float, pos : Vector3, rot : Quaternion, cp : float){	
		itemType = type;
		radius = r;
		position = pos;
		rotation = rot;
		centPos = cp;
	}
	
	public function OnCollision(cell : Cell) : boolean{
		var sqrDis = (cell.position - position).sqrMagnitude;
		if(sqrDis < (cell.radius + radius) * (cell.radius + radius))
			return true;
		return false;
	}
}
//---------------------------------------------------------------------------------------------------------