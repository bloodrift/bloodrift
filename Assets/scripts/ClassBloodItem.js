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
	
	public function ActOn(cell : Cell, cam : Cell){
		switch (itemType){
			case Global.typeATP :
				cell.energy += 1;
				break;
			case Global.typeVIRUS :
				cell.life -= 1;
				var Perlin_Noise : Perlin_Noise = cam.instance.GetComponent(Perlin_Noise);
				Perlin_Noise.test = true;
				break;
		}
	}
}
//---------------------------------------------------------------------------------------------------------