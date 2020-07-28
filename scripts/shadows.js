console.log('shadows enabled');
Hooks.on("preUpdateToken", async (scene, token, updateData, options) => {
    let elevation = getProperty(updateData, "elevation");
    let tokenInstance = canvas.tokens.get(token._id);
    console.log(elevation)
    let params =
    [{
        filterType: "twist",
        filterId: "autoTwist",
        autoDestroy: true,
        padding: 10,
        radiusPercent: 600,
        angle: 0,
        animated:
        {
            angle:         
            { 
                active: true, 
                animType: "syncSinOscillation",
                loopDuration: 6000, 
                val1: -0.03*Math.PI, 
                val2: +0.03*Math.PI
            }
        }
    },
    {
        filterType: "bulgepinch",
        filterId: "autoBulge",
        padding: 10,
        autoDestroy: true,
        strength: 0,
        zIndex: 2,
        radiusPercent: (elevation*5),
        animated:
        {
            strength: 
            { 
               active: true, 
               animType: "syncCosOscillation", 
               loopDuration: 6000, 
               val1: 0.3, 
               val2: .35
            }
        }
    },
    {
        filterType: "shadow",
        filterId: "autoShadow",
        rotation: 35,
        autoDestroy: true,
        blur: 2,
        quality: 5,
        distance: elevation,
        alpha: 0.33,
        padding: 10,
        shadowOnly: false,
        color: 0x000000,
        animated:
        {
            blur:     
            { 
               active: true, 
               loopDuration: 6000, 
               animType: "syncCosOscillation", 
               val1: 2, 
               val2: 3
            },
            distance:
            {
               active: true,
               loopDuration: 6000,
               animType: "syncSinOscillation",
               val1: 75,
               val2: 80
            },
            alpha:
            {
               active: true,
               loopDuration: 6000,
               animType: "syncSinOscillation",
               val1: .33,
               val2: .2
             }
         }
    }
    ];
    if (elevation === undefined) {
        return;
    }
    let filter = (elevation > 5) ? true : false;
    console.log(params)
 await TokenMagic.deleteFiltersOnSelected("autoShadow");
 await TokenMagic.deleteFiltersOnSelected("autoTwist");
 await TokenMagic.deleteFiltersOnSelected("autoBulge");
    if (filter) {
        console.log('final test');
        await TokenMagic.addUpdateFilters(tokenInstance, params);
    } 
});