#pragma strict
var hitATP : AudioClip;
var hitVirus : AudioClip;

function HitATP(){
	audio.PlayOneShot(hitATP);
}

function HitVirus(){
	audio.PlayOneShot(hitVirus);
}