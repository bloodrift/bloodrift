#pragma strict
//---------------------------------------------------------------------------------------------------------
public class BloodItem{
	public var itemType : int;
	public var centPos : int;
	public var radius : float;
	public var position : Vector3;
	public var rotation : Quaternion;
	public var instance : GameObject;
	static public var GUICarrier : GameObject = GameObject.Find("GUICarrier");
;
	
	public function BloodItem(type : int, r : float, pos : Vector3, rot : Quaternion, cp : float){	
		itemType = type;
		radius = r;
		position = pos;
		rotation = rot;
		centPos = cp;
	}
	
	public function OnCollision(cell : Cell) : boolean{
		var cellRadius = cell.getRadiusInDir(cell.position - position);
		var sqrDis = (cell.position - position).sqrMagnitude;
		if(sqrDis < (cellRadius + radius) * (cellRadius + radius))
			return true;
		return false;
	}
	
	public function ActOn(cell : Cell, cam : Cell){
		switch (itemType){
			case Global.typeATP :
				cell.energy += 5;
				if(cell.energy > 100)
					cell.energy = 100;
				GUICarrier.SendMessage("OnHitATP", cell.energy);
				break;
			case Global.typeVIRUS :
				cell.life -= 10;
				if(cell.life <= 0){
					cell.life = 0;
				//	cell.energy = 100;
				}
				this.instance.SendMessage("SetSpeed", cell.speed);
				this.instance.SendMessage("Explode", cell.rotation);
				GUICarrier.SendMessage("OnHitVirus", cell.life);
				var Perlin_Noise : Perlin_Noise = cam.instance.GetComponent(Perlin_Noise);
				Perlin_Noise.test = true;
				break;
			case Global.typeHEMO :
				cell.life += 20;
				if(cell.life > 100)
					cell.life = 100;	
				GUICarrier.SendMessage("OnHitHemoglobin", cell.life);
				break;
		}
	}
}
//---------------------------------------------------------------------------------------------------------