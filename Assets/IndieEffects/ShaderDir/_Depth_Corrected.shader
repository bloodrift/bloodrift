Shader "IndieEffects/DepthTexture_Corrected" {
SubShader {
Tags {"RenderType" = "Fog" "Queue"="Transparent"}

Pass {
    Fog { Mode Off }
    Lighting Off
    Cull off

    CGPROGRAM
    #pragma target 3.0
    #pragma vertex vert
    #pragma fragment frag
    #include "UnityCG.cginc"

    struct v2f {
        float4 pos : POSITION;
        float2 depth : TEXCOORD0;
    };

    v2f vert( appdata_base v ) {
        v2f o;
        o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
        COMPUTE_EYEDEPTH(o.depth);
        //normalize(o.depth.x); //normalize to 0...1
        return o;
    }

    float4 frag(v2f i) : COLOR {

    //This is the calculation from wikipedia. Simple but!...
    //farClip = 50
    //nearClip = 0.5
//        float a = (50 + 0.5) / ( 50 - 0.3);
//        float b = -2 * 50 * 0.3 / (50-0.3);
//        float z = i.depth.x;
//   
//        float4 d = a + b/z;

//        I think your depth texture looks better!
//        Only in the ssao shader it looks wrong
        float4 d = i.depth.x / 50;
   
        float4 c;
        c.r = d;
        c.g = d;
        c.b = d;
        c.a = d;

        return c;
    }

    ENDCG
    }
}
}