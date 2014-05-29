#pragma strict
//---------------------------------------------------------------------------------------------------------
public class BloodItem{
	public var itemType : int;
	public var radius : float;
	public var position : Vector3;
	public var rotation : Quaternion;
	public var instance : GameObject;
	
	public function BloodItem(type : int, r : float, pos : Vector3, rot : Quaternion){	
		itemType = type;
		radius = r;
		position = pos;
		rotation = rot;
	}
	
	public function OnCollision(cell : Cell) : boolean{
		var sqrDis = (cell.position - position).sqrMagnitude;
		if(sqrDis < (cell.radius + radius) * (cell.radius + radius))
			return true;
		return false;
	}
	
	public function ActOn(cell : Cell){
		switch (itemType){
			case 0:
				cell.score += 1;
				break;
			case 1:
				if (!cell.onRush){
					cell.score -= 10;
				}
				break;
			default:
				break;
		}
	}
}
//---------------------------------------------------------------------------------------------------------
