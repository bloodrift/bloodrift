#pragma strict

var Start_Page : GameObject;
var Menu_Page : GameObject;

function OnClick(){

	NGUITools.SetActive(Menu_Page, true);
	NGUITools.SetActive(Start_Page, false);
	
}