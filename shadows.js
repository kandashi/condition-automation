console.log('shadows enabled');
Hooks.on("preUpdateToken", async (scene, token, updateData, options) => {
    let elevation = getProperty(updateData, "elevation");
    let tokenInstance = canvas.tokens.get(token._id);
    console.log(elevation)
    let params =
        [{
            filterType: "shadow",
            filterId: "autoShadows",
            autoDestroy: true,
            rotation: 35,
            blur: 2,
            quality: 5,
            alpha: 0.7,
            distance: elevation,
            padding: 10,
            shadowOnly: false,
            color: 0x000000,
            animated:
            {
                blur:
                {
                    active: true,
                    loopDuration: 1000,
                    loops: Infinity,
                    animType: "syncCosOscillation",
                    val1: 2,
                    val2: 4
                },
                rotation:
                {
                    active: true,
                    loopDuration: 200,
                    loops: Infinity,
                    animType: "syncSinOscillation",
                    val1: 33,
                    val2: 37
                }
            }
        }];
    if (elevation === undefined) {
        return;
    }
    let filter = (elevation > 5) ? true : false;
    console.log(params)
 await TokenMagic.deleteFiltersOnSelected("autoShadows");
    if (filter) {
        console.log('final test');
        await TokenMagic.addFilters(tokenInstance, params);
    } 
});