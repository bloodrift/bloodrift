#pragma strict

function Start () {

}

function playerPlaneMoveDir()
{
	return Vector3.forward;
}

function Update () {

	 var _playerPlaneMoveDir: Vector3= playerPlaneMoveDir();
	transform.Translate(_playerPlaneMoveDir*Time.deltaTime);

}