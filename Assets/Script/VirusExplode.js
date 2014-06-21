#pragma strict
var VirusCollision : GameObject;
var speed = 0;

function Start () {

}

function Update () {

}
function SetSpeed(speed : float){
	this.speed = speed;
}

function Explode(rotation : Quaternion){
	var vc : GameObject = Instantiate(VirusCollision, transform.position, rotation);
	vc.transform.TransformDirection (Vector3.forward * speed * 10);
	Destroy(vc, 1);
}