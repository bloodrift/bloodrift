Shader "Custom/_DepthNormals" {
	
	CGINCLUDE
	#include "UnityCG.cginc"

	struct v2f {
		float4 pos : SV_POSITION;
		float3 color : COLOR0;
	};
	
	struct v2f_depth {
		float4 pos : POSITION;
		float2 depth : TEXCOORD0;
	};
	
	v2f vert (appdata_full v)
	{
		v2f o;
		o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
		o.color = COMPUTE_VIEW_NORMAL;
		return o;
	}

	half4 fragTan (v2f i) : COLOR
	{
		half4 col = half4 (i.color,1);
		return col;
	}
	ENDCG
	
	SubShader {
	lighting off
		Pass {
		blend off
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment fragTan
			#pragma target 3.0
			ENDCG
		}
	}
	FallBack off
}
