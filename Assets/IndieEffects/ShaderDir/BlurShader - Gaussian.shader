Shader "Custom/BlurShaderGaussian" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Amount ("Blur Amount", Range(0,4)) = 1
	}
	
	CGINCLUDE
	#include "UnityCG.cginc"
	
	sampler2D _MainTex;
	float4 _MainTex_TexelSize;
	float _Amount;
	float _Threshold;
	
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
	
	half4 frag (v2f i) : COLOR
	{
		float4 col = tex2D(_MainTex, i.uv);
		
		return col;
	}
	
	half4 fragC (v2f i) : COLOR
	{
 		float4 col = tex2D(_MainTex, i.uv);
		half4 sum = half4(0.0);
 
		sum += tex2D(_MainTex, float2(i.uv.x - 1.0 * _Amount, i.uv.y));// * 0.025;
		sum += tex2D(_MainTex, float2(i.uv.x - 1.0 * _Amount, i.uv.y - 1.0 * _Amount));// * 0.025;
		sum += tex2D(_MainTex, float2(i.uv.x, i.uv.y - 2.0 * _Amount));// * 0.025;
		sum += tex2D(_MainTex, float2(i.uv.x + 1.0 * _Amount, i.uv.y - 1.0 * _Amount));// * 0.025;
		sum += tex2D(_MainTex, float2(i.uv.x + 1.0 * _Amount, i.uv.y));// * 0.025;
		sum += tex2D(_MainTex, float2(i.uv.x + 1.0 * _Amount, i.uv.y + 1.0 * _Amount));// * 0.025;
		sum += tex2D(_MainTex, float2(i.uv.x, i.uv.y + 2.0 * _Amount));// * 0.025;
		sum += tex2D(_MainTex, float2(i.uv.x + 1.0 * _Amount, i.uv.y + 1.0 * _Amount));// * 0.025;
 		
 		return col + sum;
	}
	
	ENDCG
	
	SubShader {
		ZTest Always Cull Off ZWrite Off
		pass {
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#pragma target 3.0
			ENDCG
		}
		pass {
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment fragC
			#pragma target 3.0
			ENDCG
		}
	}
}
