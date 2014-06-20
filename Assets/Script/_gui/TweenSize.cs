using UnityEngine;
using System.Collections;

public class TweenSize : UITweener {

	public float from = 1f;
	public float to = 1f;
	
	Transform mTrans;
	UIScrollBar mWidget;
	//UIPanel mPanel;
	
	/// <summary>
	/// Current alpha.
	/// </summary>
	
	public float size
	{
		get
		{
			if (mWidget != null) return mWidget.barSize;
			//if (mPanel != null) return mPanel.alpha;
			return 0f;
		}
		set
		{
			if (mWidget != null) mWidget.barSize = value;
			//else if (mPanel != null) mPanel.alpha = value;
		}
	}
	
	/// <summary>
	/// Find all needed components.
	/// </summary>
	
	void Awake ()
	{
		//mPanel = GetComponent<UIPanel>();
		//if (mPanel == null) 
		mWidget = GetComponent<UIScrollBar>();
	}
	
	/// <summary>
	/// Interpolate and update the alpha.
	/// </summary>
	
	protected override void OnUpdate (float factor, bool isFinished) { size = Mathf.Lerp(from, to, factor); }
	
	/// <summary>
	/// Start the tweening operation.
	/// </summary>
	
	static public TweenSize Begin (GameObject go, float duration, float size)
	{
		TweenSize comp = UITweener.Begin<TweenSize>(go, duration);
		comp.from = comp.size;
		comp.to = size;
		
		if (duration <= 0f)
		{
			comp.Sample(1f, true);
			comp.enabled = false;
		}
		return comp;
	}
}
