using UnityEngine;
using System.Collections;

[RequireComponent(typeof(AudioSource))]
[RequireComponent(typeof(AudioListener))]
public class AudioSystem : MonoBehaviour {

	public AudioClip backgroundClip;
	public AudioClip hitVirusClip;
	public AudioClip bloodEmergencyClip;
	public AudioClip hitATPClip;
	public AudioClip hitHemoClip;
	public AudioClip hitWallClip;
	public AudioClip fullEnergyClip;
	public AudioClip releaseEnergyClip;
	public AudioClip speedUpClip; 
	public AudioClip gameStartClip;
	public AudioClip gameOverClip;

	AudioSource defaultSource;
	AudioSource background;
	AudioSource bloodEmergency;
	AudioSource speedUp;

	public void OnHitVirus(){
		defaultSource.PlayOneShot(hitVirusClip);
	}
	public void OnBloodEmergency(){
		bloodEmergency.Play();
		//audio.PlayOneShot(bloodEmergency);
	} 
	public void ExitBloodEmergency(){
		bloodEmergency.Stop();
	}

	public void OnHitATP(){
		defaultSource.PlayOneShot(hitATPClip);
	}

	public void OnHitHemo(){
		defaultSource.PlayOneShot(hitHemoClip);
	}

	public void OnHitWall(){
		defaultSource.PlayOneShot(hitWallClip);
	}

	public void OnFullEnergy(){
		defaultSource.PlayOneShot(fullEnergyClip);
	}
	public void OnReleaseEnergy(){
		defaultSource.PlayOneShot(releaseEnergyClip);
	}
	public void OnSpeedUp(){
		speedUp.Play();
	}
	public void ExitSpeedUp(){
		speedUp.Stop();
	}

	public void OnGameStart(){
		defaultSource.PlayOneShot(gameStartClip);
	}

	public void OnGameOver(){
		defaultSource.volume = 1f;
		defaultSource.PlayOneShot(gameOverClip);
	}

	public void Awake(){

		background = GetComponent<AudioSource>();
		background.clip = backgroundClip;
		background.playOnAwake = true;
		background.Play();

		defaultSource = gameObject.AddComponent<AudioSource>();
		defaultSource.playOnAwake = false;

		bloodEmergency = gameObject.AddComponent<AudioSource>();
		bloodEmergency.clip = bloodEmergencyClip;
		bloodEmergency.playOnAwake = false;

		speedUp = gameObject.AddComponent<AudioSource>();
		speedUp.clip = speedUpClip;
		speedUp.playOnAwake = false;
	}
	public void OnMute(bool mute){
		AudioListener.pause = mute;
	}

}
