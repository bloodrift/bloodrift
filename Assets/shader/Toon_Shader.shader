Shader "Custom/Toon Shading" {
   Properties {
      _Diffuse_Color ("Diffuse Color", Color) = (1,1,1,1) 
      _Unlit_Diffuse_Color ("Unlit Diffuse Color", Color) = (0.5,0.5,0.5,1)
      _DiffuseThreshold ("Threshold for Diffuse Colors", Range(0,1)) = 0.1 
     
      _Outline_Color ("Outline Color", Color) = (0,0,0,1)
      _LitOutlineThickness ("Lit Outline Thickness", Range(0,1)) = 0.2
      _UnlitOutlineThickness ("Unlit Outline Thickness", Range(0,1)) = 0.4
      
      _SpecColor ("Specular Color", Color) = (1,1,1,1) 
      _Shininess ("Shininess", Float) = 10
   }
   SubShader {
      Pass {      
         Tags { "LightMode" = "ForwardBase" } 
 
         CGPROGRAM
 
         #pragma vertex vert  
         #pragma fragment frag 
 
         #include "UnityCG.cginc"
         uniform float4 _LightColor0; // color of light source 
 
         uniform float4 _Diffuse_Color; 
         uniform float4 _Unlit_Diffuse_Color;
         uniform float _DiffuseThreshold;
         
         uniform float4 _OutlineColor;
         uniform float _LitOutlineThickness;
         uniform float _UnlitOutlineThickness;
         
         uniform float4 _SpecColor; 
         uniform float _Shininess;
 
         struct vertexInput {
            float4 vertex : POSITION;
            float3 normal : NORMAL;
         };
         struct vertexOutput {
            float4 sv_pos : SV_POSITION;
            float4 world_pos : TEXCOORD0;
            float3 normalDir : TEXCOORD1;
         };
 
         vertexOutput vert(vertexInput input) 
         {
            vertexOutput output;
 
 			output.sv_pos = mul(UNITY_MATRIX_MVP, input.vertex);
            output.world_pos = mul(_Object2World, input.vertex);
            output.normalDir = normalize(float3( mul(float4(input.normal, 0.0), _World2Object)));
           
            return output;
         }
 
         float4 frag(vertexOutput input) : COLOR
         {
            float3 normalDirection = normalize(input.normalDir);
            float3 viewDirection   = normalize(_WorldSpaceCameraPos - float3(input.world_pos));
            float3 lightDirection  = normalize(float3(_WorldSpaceLightPos0));
 
 			// default: unlit area
            float3 fragmentColor = float3(_Unlit_Diffuse_Color); 
 
            // diffuse illumination
            if ( max(0.0, dot(normalDirection, lightDirection)) >= _DiffuseThreshold)
            {
               fragmentColor = float3(_LightColor0)* float3(_Diffuse_Color); 
            }
 
            // outline
            if (dot(viewDirection, normalDirection) < lerp(_UnlitOutlineThickness, _LitOutlineThickness, max(0.0, dot(normalDirection, lightDirection))))
            {
               fragmentColor = float3(_LightColor0) * float3(_OutlineColor); 
            }
 
            //  highlights
            if (dot(normalDirection, lightDirection) > 0.0 
               &&  pow(max(0.0, dot( reflect(-lightDirection, normalDirection), viewDirection)), _Shininess) > 0.5) 
            {
               fragmentColor = float3(0.8,0.8,0.8);             
            }
 
            return float4(fragmentColor, 1.0);
         }
 
         ENDCG
      }
 
      
   } 
   
   // Fallback "Specular"
}