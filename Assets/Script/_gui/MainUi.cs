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

	public float atpReward = 5;

	void OnShakeScreen(bool isShake){
		//if(isShake)
			//shakeScreen.Play(true);

		shakeScreen.enabled   = isShake;
		shakeScreenBg.enabled = isShake;

		if(!isShake){
			bloodBarFgTA.alpha = 1;
		}
		bloodBarFgTA.enabled = isShake;


	}

	// display currentBlood
	void OnUpdateBlood(int blood){
		currentBlood = blood;
		// OnGameOver called by MainLogic.
//		if(currentBlood <= 0){
//			OnGameOver ();
//			return;
//		}

		float percentage = currentBlood / totalBlood;

		// first time enter emergent situation.
		if( percentage <= bloodWarningThresh && bloodPercentage > bloodWarningThresh){
			OnShakeScreen(true);
		}
		else if(percentage > bloodWarningThresh && bloodPercentage <= bloodWarningThresh){
			OnShakeScreen(false);
		}

		bloodPercentage = percentage;
		bloodBar.barSize = bloodPercentage;
	}

//	void OnHitHemoglobin(int blood){
//		currentBlood = blood;
//		float percentage = currentBlood / totalBlood;
//		// first time exiting from emergent situation.
//		if(percentage > bloodWarningThresh &&
//		   bloodPercentage <= bloodWarningThresh){
//			OnShakeScreen(false);
//		}
//		bloodPercentage = percentage;
//		bloodBar.barSize = bloodPercentage;
//	}
	
	IEnumerator OnFullEnergy(){

		energyBarTC.Play(true);
		yield return new WaitForSeconds(2);
		energyBarTC.enabled = false;
	}

	void OnHitATP(float energy){
		currentEnergy = energy;
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

//	void OnGameOver(){
//		gameObject.GetComponent<GUICarrier>().OnGameOver(distanceLbl.text);
//	}

	UILabel distanceLbl;
	void OnUpdateDistance(float distance){
		if(distanceLbl) // if game started
			distanceLbl.text = Mathf.FloorToInt(distance).ToString();
	}

	// Use this for initialization
	public void OnGameStart () {
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

		distanceLbl = GameObject.Find("DistanceLbl").GetComponent<UILabel>();
	}
	
}
