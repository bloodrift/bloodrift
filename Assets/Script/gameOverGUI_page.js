#pragma strict
import System.IO;

var you_text : GameObject;
var highest_text : GameObject;

 
function Start () {
		
	var sr : StreamReader = new StreamReader("userinfo.txt");
	var highest_str : String;
	var user_str : String;
	
	user_str = sr.ReadLine();
	highest_str= sr.ReadLine();
	
	//Debug.Log(highest_str);
	
	var highest_distance :int = int.Parse(highest_str);
	var user_distance : int = int.Parse(user_str);
	if( user_distance > highest_distance ){
		highest_distance = user_distance;
	}
	
	you_text.GetComponent(UILabel).text = ""+user_distance ; 
	highest_text.GetComponent(UILabel).text = "Highest Distance : " + highest_distance; 

}