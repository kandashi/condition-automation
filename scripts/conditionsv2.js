console.log("ConditionsV2 active")
Hooks.on("updateToken", (token, updateData) => {
    (async () => {
        for (const t of canvas.tokens.placeables) {
            const blinded = t.data.effects.includes("modules/combat-utility-belt/icons/blinded.svg")
            t.update({ vision: false });


            //speed restrictions
            let petrified = t.data.effects.includes("modules/combat-utility-belt/icons/petrified.svg");
            let incapacitated = t.data.effects.includes("modules/combat-utility-belt/icons/incapacitated.svg");
            let restrained = t.data.effects.includes("modules/combat-utility-belt/icons/restrained.svg");
            let grappled = t.data.effects.includes("modules/combat-utility-belt/icons/grappled.svg");
            let stunned = t.data.effects.includes("modules/combat-utility-belt/icons/stunned.svg");
            let unconsious = t.data.effects.includes("icons/svg/unconscious.svg")
            let currentSpeed = t.getFlag('world', 'currentSpeed');
            //if effects present but no current reduction then store speed data and reduce to 0 
            if ((petrified || incapacitated || restrained || grappled || stunned || unconsious) && !currentSpeed) {
                currentSpeed = t.actor.data.data.attributes.speed.value
                await t.setFlag(`world`, `currentSpeed`, t.actor.data.data.attributes.speed.value);
                await t.actor.update({ "data.attributes.speed.value": `0 ft` });
                //if effects not present and speed reduction is in place then replace speed and remove speed flag
            } else if (!(petrified || incapacitated || restrained || grappled || stunned || unconsious) && currentSpeed) {
                await t.actor.update({ "data.attributes.speed.value": currentSpeed });
                await t.unsetFlag('world', 'currentSpeed');
            }



            //exhaustion
            let exhaustion1 = t.data.effects.includes("modules/combat-utility-belt/icons/exhaustion1.svg");
            let exhaustion2 = t.data.effects.includes("modules/combat-utility-belt/icons/exhaustion2.svg");
            let exhaustion3 = t.data.effects.includes("modules/combat-utility-belt/icons/exhaustion3.svg");
            let exhaustion4 = t.data.effects.includes("modules/combat-utility-belt/icons/exhaustion4.svg");
            let exhaustion5 = t.data.effects.includes("modules/combat-utility-belt/icons/exhaustion5.svg");
            let currentSpeedExhaustion = t.getFlag(`world`, `currentSpeedExhaustion`);
            //check exhaustion effects and no current reduction
            if ((exhaustion2 || exhaustion3 || exhaustion4) && !currentSpeedExhaustion) {
                currentSpeedExhaustion = t.actor.data.data.attributes.speed.value
                //write original speed value as flag
                await t.setFlag(`world`, `currentSpeedExhaustion`, t.actor.data.data.attributes.speed.value)
                //update speed to 1/2 value
                await t.actor.update({ "data.attributes.speed.value": `${parseInt(currentSpeedExhaustion) / 2} ft` });
            } else if (exhaustion5) {
                //query flag for exhaustion, if not set exhaustion flag
                if (!currentSpeedExhaustion) {
                    await t.setFlag(`world`, `currentSpeedExhaustion`, t.actor.data.data.attributes.speed.value)
                    //set speed to 0
                } await t.actor.update({ "data.attributes.speed.value": `0 ft` });
            } else if (!exhaustion5 && (exhaustion2 || exhaustion3 || exhaustion4)) {
                //remove exhaustion down to 1/2 speed 
                await t.actor.update({ "data.attributes.speed.value": `${parseInt(currentSpeedExhaustion) / 2} ft` });
                //if no exhaustion 
            } else if (!(exhaustion1 || exhaustion2 || exhaustion3 || exhaustion4 || exhaustion5)) {
                //remove speed reduction
                await t.actor.update({ "data.attributes.speed.value": currentSpeedExhaustion })
                //remove exhaustion flag
                await t.unsetFlag(`world`, `currentSpeedExhaustion`)
            }



            //prone
            let prone = t.data.effects.includes("modules/combat-utility-belt/icons/prone.svg");
            let currentSpeedProne = t.getFlag(`world`, `currentSpeedProne`);
            if (prone && !currentSpeedProne) {
                currentSpeedProne = t.actor.data.data.attributes.speed.value
                await t.setFlag(`world`, `currentSpeedProne`, t.actor.data.data.attributes.speed.value)
                console.log(currentSpeedProne)
                await t.actor.update({ "data.attributes.speed.value": `${parseInt(currentSpeedProne) / 2} ft` });
            } else if (!prone && currentSpeedProne) {
                await t.actor.update({ "data.attributes.speed.value": currentSpeedProne })
                await t.unsetFlag(`world`, `currentSpeedProne`)
            }
        }
    })();
});