const conditionAutomationConfig = [{
    name: 'Blinded',
    data: {
        name: 'Blinding Setting',
        scope: 'world',
        type: Number,
        default: 0,
        config: true,
        hint: "Toggles the 'blinded' effect on token vision, setting their vision ark to 1 degree when blinded.",
        choices: {
            0: "Disabled",
            1: "1 Degree sight angle",
            2: "Removes Vision",
            3: "Perfect Vision limit sight"
        }
    },
},
{
    name: 'BlindStatus',
    data: {
        name: "Blind Status Name",
        hint: "Name of the effect to search for, default Blinded. For CUB change to Blinded",
        scope: "world",
        config: true,
        default: "Blind",
        type: String,
    }
},
{
    name: 'npcVision',
    data: {
        name: 'Enable unlinked token vision settings',
        scope: 'world',
        type: Boolean,
        default: false,
        config: true,
        hint: "Allows NPCs to be affected by the blinded setting",
    }
},
{
    name: 'shadows',
    data: {
        name: 'Shadow Setting',
        scope: 'world',
        type: Boolean,
        default: false,
        config: true,
        hint: "Toggles the elevation-shadow animation effects.",
        onChange: () => {
            if (!game.modules.get("tokenmagic")?.active && game.settings.get('condition-automation', 'shadows')) {
                ui.notifications.error("Condition Automation shadow effects cannot work without Token Magic FX enabled")
            }
        },
    }
}];


Hooks.once('init', () => {
    conditionAutomationConfig.forEach((cfg) => {
        game.settings.register('condition-automation', cfg.name, cfg.data);
    });
});

console.log("ConditionsV2.1.0 active");

Hooks.on("ready", () => {
    if (game.system.id === "dnd5e") {
        Hooks.on("preCreateActiveEffect", async (actor, effects, options, someID) => {
            const blindedSetting = game.settings.get('condition-automation', 'Blinded');
            const blindStatus = game.settings.get('condition-automation', 'BlindStatus');
            let blinded = effects.label === blindStatus;
            let token = actor.getActiveTokens()[0]
            let actorToken = game.actors.get(actor.data._id)
            if (blinded) {
                switch (blindedSetting) {
                    case 1: {
                        actorToken.setFlag('condition-automation', 'sightAngleOld', actorToken.data.token.sightAngle)
                        token.update({ "sightAngle": 1 });
                        actorToken.update({ "token.sightAngle": 1 })
                    }
                        break;
                    case 2: {
                        token.update({ "vision": false });
                        actorToken.update({ "token.vision": false })
                    }
                        break;
                    case 3: {
                        let oldVision = token.getFlag('perfect-vision', 'sightLimit');
                        token.setFlag('condition-automation', 'PVold', oldVision);
                        token.setFlag('perfect-vision', 'sightLimit', 0);
                        actorToken.setFlag('perfect-vision', 'sightLimit', 0);
                    }
                        break;
                }
            }
        });

        Hooks.on("preDeleteActiveEffect", async (actor, effects, options, someID) => {
            const blindedSetting = game.settings.get('condition-automation', 'Blinded');
            const blindStatus = game.settings.get('condition-automation', 'BlindStatus');
            let blinded = effects.label === blindStatus;
            let token = actor.getActiveTokens()[0]
            let actorToken = game.actors.get(actor.data._id)
            if (blinded) {
                switch (blindedSetting) {
                    case 1: {
                        let visionArc = actorToken.getFlag('condition-automation', 'sightAngleOld')
                        token.update({ "sightAngle": visionArc });
                        actorToken.update({ "token.sightAngle": visionArc })
                    }
                        break;
                    case 2: {
                        token.update({ "vision": true });
                        actorToken.update({ "token.vision": true })
                    }
                        break;
                    case 3: {
                        let oldVision = token.getFlag('condition-automation', 'PVold');
                        if (oldVision) {
                            token.setFlag('perfect-vision', 'sightLimit', oldVision);
                            actorToken.setFlag('perfect-vision', 'sightLimit', oldVision);
                        }
                        else {
                            token.unsetFlag('perfect-vision', 'sightLimit');
                            actorToken.unsetFlag('perfect-vision', 'sightLimit');
                        }
                        break;
                    }
                }
            }
        })

        Hooks.on("preUpdateToken", (scene, token, update) => {
            if(game.settings.get('condition-automation', 'npcVision') === false) return;
            let tokenInstance = canvas.tokens.get(token._id)
            const blindedSetting = game.settings.get('condition-automation', 'Blinded');
            const blindStatus = game.settings.get('condition-automation', 'BlindStatus');
            if (!update?.actorData?.effects) return;
            let blinded = update.actorData.effects.find(i => i.label === blindStatus);
            let currentlyBlinded = token.actorData?.effects?.find(i => i.label === blindStatus)
            if (blinded && !currentlyBlinded) {
                switch (blindedSetting) {
                    case 1: {
                        tokenInstance.setFlag('condition-automation', 'sightAngleOld', token.sightAngle)
                        update.sightAngle = 1;
                    }
                        break;
                    case 2: {
                        update.vision = false;
                    }
                        break;
                    case 3: {
                        let oldVision = tokenInstance.getFlag('perfect-vision', 'sightLimit');
                        tokenInstance.setFlag('condition-automation', 'PVold', oldVision);
                        tokenInstance.setFlag('perfect-vision', 'sightLimit', 0);
                    }
                        break;
                }
            }
            else if (!blinded && currentlyBlinded ){
                switch (blindedSetting) {
                    case 1: {
                        let visionArc = tokenInstance.getFlag('condition-automation', 'sightAngleOld')
                        update.sightAngle = visionArc;
                        tokenInstance.unsetFlag('condition-automation', 'sightAngleOld')
                    }
                        break;
                    case 2: {
                        update.vision= true ;
                    }
                        break;
                    case 3: {
                        let oldVision = tokenInstance.getFlag('condition-automation', 'PVold');
                        if(typeof oldVision !== 'number') oldVision = ""
                        tokenInstance.setFlag('perfect-vision', 'sightLimit', oldVision);
                        tokenInstance.unsetFlag('condition-automation', 'PVold');
                    }
                        break;
                }
            }
        })
    }

    if (game.system.id === "pf2e") {
        const itemName = game.settings.get('condition-automation', 'BlindStatus')
        Hooks.on("preUpdateToken", (scene, token, update) => {
            if(game.settings.get('condition-automation', 'npcVision') === false) return;

            if (!update.actorData?.items) return;
            let tokenInstance = canvas.tokens.get(token._id)
            const blindedSetting = game.settings.get('condition-automation', 'Blinded');
            const blinded = tokenInstance.getFlag('condition-automation', 'sight')
            if (update.actorData.items.filter(i => i.type === 'condition' && i.flags[game.system.id]?.condition && i.name === `${itemName}`).length > 0) {
                if (!blinded) {
                    switch (blindedSetting) {
                        case 1: {
                            let visionArc = token.sightAngle
                            tokenInstance.setFlag('condition-automation', 'sight', visionArc)
                            update.sightAngle = 1;
                        }
                            break;
                        case 2: {
                            tokenInstance.setFlag('condition-automation', 'sight', 1)
                            update.vision = false;
                        }
                            break;
                        case 3: {
                            let oldVision = tokenInstance.getFlag('perfect-vision', 'sightLimit');
                            tokenInstance.setFlag('condition-automation', 'sight', oldVision);
                            tokenInstance.setFlag('perfect-vision', 'sightLimit', 0);
                        }
                            break;
                    }
                }
            }
            else if (blinded) {
                switch (blindedSetting) {
                    case 1: {
                        let visionArc = tokenInstance.getFlag('condition-automation', 'sight')
                        update.sightAngle = visionArc;
                        tokenInstance.unsetFlag('condition-automation', 'sight')
                    }
                        break;
                    case 2: {
                        tokenInstance.unsetFlag('condition-automation', 'sight')
                        update.vision = true;
                    }
                        break;
                    case 3: {
                        let oldVision = tokenInstance.getFlag('condition-automation', 'sight');
                        tokenInstance.setFlag('perfect-vision', 'sightLimit', oldVision);
                        tokenInstance.unsetFlag('condition-automation', 'sight');
                    }
                        break;
                }
            }

        })

        Hooks.on("createOwnedItem", (actor, item) => {
            let test;
            if (item.type === 'condition' && item.flags[game.system.id]?.condition && item.name === `${itemName}`) {
                const blindedSetting = game.settings.get('condition-automation', 'Blinded');
                const token = actor.getActiveTokens()[0]
                const blinded = actor.getFlag('condition-automation', 'sight')
                if (!blinded) {
                    switch (blindedSetting) {
                        case 1: {
                            let visionArc = token.data.sightAngle
                            actor.setFlag('condition-automation', 'sight', visionArc)
                            token.update({ "sightAngle": 1 });
                        }
                            break;
                        case 2: {
                            actor.setFlag('condition-automation', 'sight', 1)
                            token.update({ "vision": false });
                        }
                            break;
                        case 3: {
                            let oldVision = token.getFlag('perfect-vision', 'sightLimit');
                            actor.setFlag('condition-automation', 'sight', oldVision);
                            token.setFlag('perfect-vision', 'sightLimit', 0);
                        }
                            break;
                    }
                }
            }
        });

        Hooks.on("deleteOwnedItem", (actor, item) => {
            let test;
            if (item.type === 'condition' && item.flags[game.system.id]?.condition && item.name === `${itemName}`) {
                const blindedSetting = game.settings.get('condition-automation', 'Blinded');
                const token = actor.getActiveTokens()[0]
                const blinded = actor.getFlag('condition-automation', 'sight')
                if (blinded) {
                    switch (blindedSetting) {
                        case 1: {
                            let visionArc = actor.getFlag('condition-automation', 'sight')
                            actor.unsetFlag('condition-automation', 'sight')
                            token.update({ "sightAngle": visionArc });
                        }
                            break;
                        case 2: {
                            actor.unsetFlag('condition-automation', 'sight')
                            token.update({ "vision": true });
                        }
                            break;
                        case 3: {
                            let oldVision = actor.getFlag('condition-automation', 'sight');
                            actor.unsetFlag('condition-automation', 'sight');
                            token.setFlag('perfect-vision', 'sightLimit', oldVision);
                        }
                            break;
                    }
                }
            }
        })
    }
});

Hooks.on("preUpdateToken", async (scene, token, updateData, options) => {
    const shadowSetting = game.settings.get('condition-automation', 'shadows');
    let elevation = getProperty(updateData, "elevation");
    let tokenInstance = canvas.tokens.get(token._id);
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
                    val1: -0.03 * Math.PI,
                    val2: +0.03 * Math.PI
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
            radiusPercent: (elevation * 5),
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
    if (elevation === undefined || shadowSetting === false) {
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