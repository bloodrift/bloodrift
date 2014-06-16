using UnityEngine;
using System.Collections;

public class MainUi : MonoBehaviour {

	public const float totalBlood = 100;
	public float currentBlood;
	private float bloodPercentage;

	public const float totalEnergy = 100;
	public float currentEnergy;
	private float energyPercentage;

	TweenColor shakeScreen;
	UIWidget   shakeScreenBg;

	UIScrollBar bloodBar;
	TweenAlpha  bloodBarFgTA;
	UIScrollBar energyBar;
	TweenColor  energyBarTC;
	TweenSize   energyBarTS;


	public float virusPunish = 5;
	public float hemoglobinReward = 10;
	public float bloodWarningThresh = 0.1f;

	public float atpReward = 10;

	void OnShakeScreen(bool isShake){
		shakeScreen.enabled   = isShake;
		shakeScreenBg.enabled = isShake;

		bloodBarFgTA.enabled = isShake;
	}
	// decrease currentBlood
	void OnHitVirus(){
		currentBlood -= virusPunish;
		if(currentBlood <= 0){
			Debug.Log("GameOver!!");
			OnGameOver ();
			return;
		}

		float percentage = currentBlood / totalBlood;

		// first time enter emergent situation.
		if( percentage <= bloodWarningThresh && bloodPercentage > bloodWarningThresh){
			OnShakeScreen(true);
		}
		bloodPercentage = percentage;
		bloodBar.barSize = bloodPercentage;
	}

	void OnHitHemoglobin(){
		currentBlood += hemoglobinReward;
		float percentage = currentBlood / totalBlood;
		// first time exiting from emergent situation.
		if(percentage > bloodWarningThresh &&
		   bloodPercentage <= bloodWarningThresh){
			OnShakeScreen(false);
		}
		bloodPercentage = percentage;
		bloodBar.barSize = bloodPercentage;
	}
	
	IEnumerator OnFullEnergy(){
		//StartCoroutine();
		//Debug.Log("on full energ");
		//energyBarTC.enabled = true;
		energyBarTC.Play(true);
		yield return new WaitForSeconds(2);
		//Debug.Log("exit full energ");
		//energyBarTC.Reset();
		energyBarTC.enabled = false;
	}
	void OnHitATP(){
		currentEnergy += atpReward;
		float percentage = currentEnergy / totalEnergy;
		// first time energy is filled
		if(percentage >= 1.0 && energyPercentage < 1.0){

			StartCoroutine(OnFullEnergy());
		}

		energyPercentage = percentage;
		energyBar.barSize = energyPercentage;
	}
	void OnRelease(){
		if( energyPercentage >= 1.0){
			currentEnergy = 0;
			energyPercentage = currentEnergy/totalEnergy;
			// animation of clear energyBar;
			// play (forward)
			energyBarTS.Play(true);
		}
	}

	void OnGameOver(){
		Debug.Log("GameOver!!");
	}

	// Use this for initialization
	void Start () {
		GameObject go_shakeScreen = GameObject.Find("ShakeScreen");
		shakeScreen   = go_shakeScreen.GetComponent<TweenColor>();
		shakeScreenBg = go_shakeScreen.GetComponentInChildren<UIWidget>();
	
		GameObject go_bloodBar = GameObject.Find("BloodBar");
		bloodBar = go_bloodBar.GetComponent<UIScrollBar>();
		bloodBarFgTA = go_bloodBar.GetComponentInChildren<TweenAlpha>();
		OnShakeScreen(false);

		GameObject go_energyBar = GameObject.Find("EnergyBar");
		energyBar = go_energyBar.GetComponent<UIScrollBar>();
		energyBarTS = go_energyBar.GetComponent<TweenSize>();
		energyBarTC = GameObject.Find("EnergyBar/Foreground").GetComponent<TweenColor>();


		currentBlood = totalBlood;
		bloodPercentage = currentBlood/totalBlood;
		bloodBar.barSize = bloodPercentage;

		currentEnergy = 0;
		energyPercentage = currentEnergy/totalEnergy;
		energyBar.barSize = energyPercentage;
	}

	// Update is called once per frame
	void Update () {
		// if blood emergency, shake the screen.
//		if(bloodEmergency){
//			shakeScreen.enabled = true;
//			shakeScreenBg.enabled = true;
//			//shakeScreen.GetComponent<TweenColor>().Reset();
//		}
//		else{
//			//shakeScreen.GetComponent<TweenColor>().enabled = false;
//			//shakeScreenBg.enabled = false;
//		}
	}
}
