Shader "Custom/DOFShader_BoxBlur" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Depth ("DepthTexture", 2D) = "black" {}
		_FStop ("F-Stop", float) = 0.5
		_Amount ("Blur Amount", Range(0,4)) = 3
	}
	
	CGINCLUDE
	#include "UnityCG.cginc"
	
	sampler2D _MainTex;
	sampler2D _Depth;
	float4 _MainTex_TexelSize;
	float _Amount;
	float _FStop;
	
	struct v2f_m {
		float4 pos : POSITION;
		float2 uv[2] : TEXCOORD0;
	};
	
	v2f_m vertC (appdata_img v)
	{
		v2f_m o;
		
		o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
		float2 uv = v.texcoord.xy;
		
		float2 up = float2(_MainTex_TexelSize.x, _MainTex_TexelSize.y);
			
		o.uv[0].xy = float2(_MainTex_TexelSize.x, _MainTex_TexelSize.y);
		o.uv[1].xy = uv;
		
		return o;
	}
	
	half4 fragC (v2f_m i) : COLOR
	{
		
		float4 col = tex2D(_MainTex, i.uv[1]);
		float4 depthTex = tex2D(_Depth, i.uv[1]);
		depthTex.a = depthTex.r;
		int radius = 12;
		int count = 0;
		float4 newCol;
		newCol.rgb = (0, 0, 0);
		for (int pix = 0; pix < radius; pix ++) {
			
			float2 uvOff = float2 (i.uv[0].x * pix, 0.0);
			float4 tmpCol = tex2D(_MainTex, i.uv[1] + uvOff);
			if (i.uv[1].x + uvOff.x <= 1.0) {
				newCol += tmpCol;
				count ++;
			}
			
			tmpCol = tex2D(_MainTex, i.uv[1] - uvOff);
			if (i.uv[1].x - uvOff.x >= 0.0) {
				newCol += tmpCol;
				count ++;
			}
			
			float2 uvOff2 = float2 (0.0, i.uv[0].y * pix);
			float4 tmpCol2 = tex2D(_MainTex, i.uv[1] + uvOff2);
			if (i.uv[1].y + uvOff.y <= 1.0) {
				newCol += tmpCol2;
				count ++;
			}
			
			tmpCol2 = tex2D(_MainTex, i.uv[1] - uvOff2);
			if (i.uv[1].y - uvOff.y >= 0.0) {
				newCol += tmpCol2;
				count ++;
			}
			
		}
		
		half4 returncol = lerp(col, (newCol + col) / (count + 1), depthTex);
		
		return returncol;
	}
	
	ENDCG
	
	SubShader {
		blend srcalpha oneminussrcalpha
		pass {
			Fog { Mode off }
			Lighting Off
			CGPROGRAM
			#pragma vertex vertC
			#pragma fragment fragC
			#pragma target 3.0
			ENDCG
		}
		pass {
			Fog { Mode off }
			Lighting Off
			CGPROGRAM
			#pragma vertex vertC
			#pragma fragment fragC
			#pragma target 3.0
			ENDCG
		}
		pass {
			Fog { Mode off }
			Lighting Off
			CGPROGRAM
			#pragma vertex vertC
			#pragma fragment fragC
			#pragma target 3.0
			ENDCG
		}
		
	}
}
