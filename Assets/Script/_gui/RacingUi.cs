using UnityEngine;
using System.Collections;

public class RacingUi : MonoBehaviour
{
	public GameObject RacingPanel;

	UILabel rankLbl;
	UILabel timeLbl;

	UILabel speedLbl;
	UIScrollBar speedBar;
	
	UILabel circleLbel;
	UIScrollBar progressBar;

	UIScrollBar energyBar;
	TweenColor  energyBarTC;
	TweenSize   energyBarTS;

	bool onRacingGame = false;

	int rank;
	int time;
	private float StartTime;

	string rank_str;  // for gameover display
	string time_str;

	int totalCircle = 3; // XXX: should be set OnRacingStart
	int circle;
	float progress; 	  // XXX: fraction or 100%?

	public const float totalEnergy = 100;
	public float currentEnergy;
	private float energyPercentage;

	float speed;
	float fullSpeed = 300f;	// XXX: should be set OnRacingStart

	public void OnUpdateRank(int i){
		rank = i; // reserved.

		rank_str = "";
		if(i == 1) 		rank_str+="1st";
		else if(i == 2)	rank_str+="2nd";
		else if(i == 3)	rank_str+="3rd";
		else 			rank_str+=i.ToString()+"th";
		rankLbl.text  = "Rank: "+ rank_str;
	}

	public void OnUpdateCircle(int circle){
		this.circle = circle;
		circleLbel.text = "Circle: "+circle.ToString()+"/"+totalCircle.ToString();
	}

	public void OnUpdateProgress(int circle, float progress){
		progressBar.barSize = progress;
	}
	
	IEnumerator OnFullEnergy(){
		energyBarTC.Play(true);
		yield return new WaitForSeconds(2);
		energyBarTC.enabled = false;
	}
	public void OnHitATPModeRacing(float energy){
		currentEnergy = energy;
		float percentage = currentEnergy / totalEnergy;
		// first time energy is filled
		if(percentage >= 1.0 && energyPercentage < 1.0){
			StartCoroutine(OnFullEnergy());
		}
		energyPercentage = percentage;
		energyBar.barSize = energyPercentage;
	}
	public void OnRelease(){
		if( energyPercentage >= 1.0){
			currentEnergy = 0;
			energyPercentage = currentEnergy/totalEnergy;
			// animation of clear energyBar;
			// play (forward)
			energyBarTS.Play(true);
		}
	}

	public void OnUpdateSpeed(float speed){
		this.speed = speed;
		speedLbl.text = "Speed: "+speed.ToString("F2"); // fixed-point.
		speedBar.barSize = speed/fullSpeed;
	}

	public void OnRacingOver(){
		onRacingGame = false;
	}
	
	public void OnRacingStart(){

		rankLbl = RacingPanel.transform.FindChild("RankLbl").GetComponent<UILabel>();
		timeLbl = RacingPanel.transform.FindChild("TimeLbl").GetComponent<UILabel>();

		circleLbel = RacingPanel.transform.FindChild("CircleLbl").GetComponent<UILabel>();
		progressBar= RacingPanel.transform.FindChild("ProgressBar").GetComponent<UIScrollBar>();

		GameObject go_energyBar = RacingPanel.transform.FindChild("EnergyBar").gameObject;
		energyBar = go_energyBar.GetComponent<UIScrollBar>();
		energyBarTS = go_energyBar.GetComponent<TweenSize>();
		energyBarTC = go_energyBar.GetComponentInChildren<TweenColor>();

		speedLbl = RacingPanel.transform.FindChild("SpeedLbl").GetComponent<UILabel>();
		speedBar = RacingPanel.transform.FindChild("SpeedBar").GetComponent<UIScrollBar>();

		StartTime = Time.time;
		onRacingGame = true;
	}

	// Update : time,
	void Update(){
		if( onRacingGame ){
			float dtime = Time.time - StartTime;
			int minute = Mathf.FloorToInt(dtime/60);
			int second = Mathf.FloorToInt(dtime%60);
			int fract  = Mathf.FloorToInt((dtime*100)%100);
			time_str = string.Format("{0:00}:{1:00}:{2:00}",minute,second,fract);
			timeLbl.text = "Time: "+ time_str;
		}
	}

	// called by GUICarrier when gameover.
	public string getAchievement(){
		return rank_str+" "+time_str;
	}
}

