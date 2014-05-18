    #pragma strict
     
    //@script RequireComponent (IndieEffects)
    @script AddComponentMenu ("Indie Effects/SSAOTest")
     
    var IndieEffects : IndieEffects;
     
    var mainTex : Texture2D;
    var depthTex : Texture2D;
    var randTex : Texture2D;
     
     
    private var materialAO : Material;
    var shaderAO : Shader;
     
    //@Range(0, 2.0)
    var strength : float = 1.0;
    //@Range(0, 1.0)
    var base : float = 0.0;
    //@Range(0.00001, 0.2)
    var area : float = 0.035;
    //@Range(0.00000005, 0.00001)
    var falloff : float = 0.01;
    //@Range(0.0001, 0.0004)
    var radius : float = 0.025;
     
    function Start () {
        IndieEffects = transform.GetComponent("IndieEffects");
        materialAO = new Material(shaderAO);
    }
     
    function Update () {
        mainTex = IndieEffects.renderTexture;
        depthTex = DepthTex;
        materialAO.SetTexture("_MainTex", mainTex);
        materialAO.SetTexture("_DepthTextureSampler", depthTex);
        materialAO.SetTexture("_RandomTextureSampler", randTex);
        materialAO.SetFloat("_Strength", strength);
        materialAO.SetFloat("_Base", base);
        materialAO.SetFloat("_Area", area);
        materialAO.SetFloat("_Falloff", falloff);
        materialAO.SetFloat("_Radius", radius);
       
    }
     
    function OnPostRender () {
        FullScreenQuadPass(materialAO,0);
        materialAO.SetTexture("_MainTex", mainTex);
        FullScreenQuadPass(materialAO,1);
    }