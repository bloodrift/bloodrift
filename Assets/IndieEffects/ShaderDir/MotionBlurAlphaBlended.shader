Shader "Indieeffects/MotionBlur" {
	Properties {
		_MainTex ("Base (RGB)", RECT) = "white" {}
		_FrameAccumulation("AccumOrig", Float) = 0.65
	}

	SubShader {
		ZTest Always Cull Off ZWrite Off
		Fog { Mode off }
		Pass {
			Blend SrcAlpha OneMinusSrcAlpha
			ColorMask RGB
			SetTexture [_MainTex] {
				ConstantColor (0,0,0,[_FrameAccumulation])
				Combine texture, constant
			}
		}
		Pass {
			Blend Zero One
			ColorMask a
			SetTexture [_MainTex] {
				Combine texture
			}
		}
	}
	Fallback off
}