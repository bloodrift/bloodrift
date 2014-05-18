#pragma strict

 

//@script RequireComponent (IndieEffects)

@script AddComponentMenu ("Indie Effects/Outline")

 

var IndieEffects : IndieEffects;

var treshold : float;

private var blurMat : Material;

var outlineShader : Shader;

 

function Start () {

 

    IndieEffects = transform.GetComponent("IndieEffects");

    blurMat = new Material(outlineShader);

}

 

function Update () {

    blurMat.SetTexture("_MainTex", IndieEffects.renderTexture);

    blurMat.SetFloat("_Treshold", treshold);

}

 

function OnPostRender () {

    FullScreenQuad(blurMat);

}