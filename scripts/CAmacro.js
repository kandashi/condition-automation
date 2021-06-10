class ConAuto {

    static systemPaths() {
        switch (game.system.id) {
            case "dnd5e": return { HP: "actorData.data.attributes.hp.value" };
            case "pf2e" : return {HP: "actorData.data.attributes.hp.value"};
            case "pf1" : return {HP: "actorData.data.attributes.hp.value"};
        }
    }

    static async shadowEffect(tokenID, elevation) {
        let tokenInstance = canvas.tokens.get(tokenID);
        let CAEffectId = "ConditionAutomationShadows"
        let twist =
        {
            filterType: "transform",
            filterId: CAEffectId,
            twRadiusPercent: 100,
            padding: 10,
            animated:
            {
                twRotation:
                {
                    animType: "sinOscillation",
                    val1: -(elevation/10),
                    val2: +(elevation/10),
                    loopDuration: 5000,
                }
            }
        }
        let shadow = {
            filterType: "shadow",
            filterId: CAEffectId,
            rotation: 35,
            blur: 2,
            quality: 5,
            distance: elevation*1.5,
            alpha: Math.min(1/ ((elevation-10)/10), 0.7),
            padding: 10,
            shadowOnly: false,
            color: 0x000000,
            zOrder: 6000,
            animated:
            {
                blur:     
                { 
                   active: true, 
                   loopDuration: 5000, 
                   animType: "syncCosOscillation", 
                   val1: 2, 
                   val2: 2.5
                },
                rotation:
                {
                   active: true,
                   loopDuration: 5000,
                   animType: "syncSinOscillation",
                   val1: 33,
                   val2: 33 + (elevation*0.8)
                }
             }
        };
        const shadowSetting = game.settings.get('condition-automation', 'shadows');
        let params = [shadow]
        if (shadowSetting === "bulge") params = [shadow, twist]

        let filter = (elevation > 5) ? true : false;
        await tokenInstance.TMFXdeleteFilters(CAEffectId)
        if (filter) {
            await TokenMagic.addUpdateFilters(tokenInstance, params);
        }
    }

    static deathEffect(tokenID) {
        let macro = game.macros.getName(game.settings.get('condition-automation', 'deadMacro'))
        let token = canvas.tokens.get(tokenID)
        if (!macro || !token) console.log("Condition Automation: No macro or token found")
        macro.execute(token)
    }

    static poisoned(token){
        let macro = game.macros.getName(game.settings.get('condition-automation', 'poisonedMacro'))
        if (!macro || !token) console.log("Condition Automation: No macro or token found")
        macro.execute(token)
    }
    static stunned(token){
        let macro = game.macros.getName(game.settings.get('condition-automation', 'stunnedMacro'))
        if (!macro || !token) console.log("Condition Automation: No macro or token found")
        macro.execute(token)
    }
    static paralyzed(token){
        let macro = game.macros.getName(game.settings.get('condition-automation', 'paralyzedMacro'))
        if (!macro || !token) console.log("Condition Automation: No macro or token found")
        macro.execute(token)
    }
    static petrified(token){
        let macro = game.macros.getName(game.settings.get('condition-automation', 'petrifiedMacro'))
        if (!macro || !token) console.log("Condition Automation: No macro or token found")
        macro.execute(token)
    }
}
