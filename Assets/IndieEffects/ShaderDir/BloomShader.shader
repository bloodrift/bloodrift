Shader "Custom/BloomShader_BoxBlur" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_BlurTex ("BlurringTex (RGB)", 2D) = "white" {}
		_Amount ("Bloom Amount", Range(0,2)) = 0.5
		_Threshold ("Threshold", Range(0,1)) = 0.5
	}
	
	CGINCLUDE
	#include "UnityCG.cginc"
	
	sampler2D _MainTex;
	sampler2D _BlurTex;
	float4 _MainTex_TexelSize;
	uniform float _Threshold;
	uniform float _Amount;
	
	struct v2f_m {
		float4 pos : POSITION;
		float2 uv[2] : TEXCOORD0;
	};
	
	struct v2f {
		float4 pos : POSITION;
		float2 uv : TEXCOORD0;
	};
	
	v2f vert (appdata_img v)
	{
		v2f o;
		
		o.pos = mul (UNITY_MATRIX_MVP, v.vertex);

		o.uv = v.texcoord.xy;
		
		return o;
	}
	v2f_m vertC (appdata_img v)
	{
		v2f_m o;
		
		o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
		float2 uv = v.texcoord.xy;
			
		o.uv[0].xy = float2(_MainTex_TexelSize.x, _MainTex_TexelSize.y);
		o.uv[1].xy = uv;
		
		return o;
	}
	
	half4 fragC (v2f_m i) : COLOR
	{
		float4 col = tex2D(_BlurTex, i.uv[1]) * 0.2270270270;
		int radius = 10;
		int count = 0;
		float4 newCol;
		newCol.rgb = col.rgb;
		for (int pix = 0; pix < radius; pix ++) {
			
			float2 uvOff = float2 (i.uv[0].x * pix, 0.0);
			float4 tmpCol = tex2D(_BlurTex, i.uv[1] + uvOff);
			if (i.uv[1].x + uvOff.x <= 1.0) {
				newCol += tmpCol;
				count ++;
			}
			
			tmpCol = tex2D(_BlurTex, i.uv[1] - uvOff);
			if (i.uv[1].x - uvOff.x >= 0.0) {
				newCol += tmpCol;
				count ++;
			}
			
			float2 uvOff2 = float2 (0.0, i.uv[0].y * pix);
			float4 tmpCol2 = tex2D(_BlurTex, i.uv[1] + uvOff2);
			if (i.uv[1].y + uvOff.y <= 1.0) {
				newCol += tmpCol2;
				count ++;
			}
			
			tmpCol2 = tex2D(_BlurTex, i.uv[1] - uvOff2);
			if (i.uv[1].y - uvOff.y >= 0.0) {
				newCol += tmpCol2;
				count ++;
			}
			
		}
		
		newCol = newCol / count * _Amount;
		
		return lerp(newCol,col,Luminance(newCol.rgb));
	}	
	ENDCG
	
	SubShader {
	Tags { "Queue"="Overlay" "RenderType"="Overlay"}
		Cull Off ZWrite Off
		fog { mode off }
		lighting off
		blend oneminusdstcolor one
		pass {
			CGPROGRAM
			#pragma vertex vertC
			#pragma fragment fragC
			#pragma target 3.0
			ENDCG
		}
		pass {
			CGPROGRAM
			#pragma vertex vertC
			#pragma fragment fragC
			#pragma target 3.0
			ENDCG
		}
		pass {
			CGPROGRAM
			#pragma vertex vertC
			#pragma fragment fragC
			#pragma target 3.0
			ENDCG
		}
	}
}
