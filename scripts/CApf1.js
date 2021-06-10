class ConAutoPF1 {
    static async blindApplyActor(actor) {
        let tokenArray = actor.getActiveTokens()
        const blindedSetting = game.settings.get('condition-automation', 'Blinded');
        switch (blindedSetting) {
            case 1: {
                actor.setFlag('condition-automation', 'sightAngleOld', actor.data.token.sightAngle)
                for (let token of tokenArray) token.update({ "sightAngle": 1 });
                actor.update({ "token.sightAngle": 1 })
            }
                break;
            case 2: {
                for (let token of tokenArray) token.update({ "vision": false });
                actorToken.update({ "token.vision": false })
            }
                break;
            case 3: {
                for (let token of tokenArray) {
                    let oldVision = token.getFlag('perfect-vision', 'sightLimit');
                    token.setFlag('condition-automation', 'PVold', oldVision);
                    token.setFlag('perfect-vision', 'sightLimit', 0);
                }
                actor.setFlag('perfect-vision', 'sightLimit', 0);
            }
                break;
        }
    }
    static async blindRemoveActor(actor) {
        let tokenArray = actor.getActiveTokens()
        const blindedSetting = game.settings.get('condition-automation', 'Blinded');
        switch (blindedSetting) {
            case 1: {
                let visionArc = actor.getFlag('condition-automation', 'sightAngleOld')
                for (let token of tokenArray) token.update({ "sightAngle": visionArc });
                actor.update({ "token.sightAngle": visionArc })
            }
                break;
            case 2: {
                for (let token of tokenArray) token.update({ "vision": true });
                actorToken.update({ "token.vision": true })
            }
                break;
            case 3: {
                for (let token of tokenArray) {
                    let oldVision = token.getFlag('condition-automation', 'PVold');
                    if (oldVision) { token.setFlag('perfect-vision', 'sightLimit', oldVision); }
                    else { token.unsetFlag('perfect-vision', 'sightLimit'); }
                }

                if (oldVision) {
                    actor.setFlag('perfect-vision', 'sightLimit', oldVision);
                } else { actor.unsetFlag('perfect-vision', 'sightLimit'); }
                break;
            }
        }
    }
}

function CAHandlePf1() {
    Hooks.on("updateActor", (actor, update) => {
        let blind = getProperty(update, "data.attributes.conditions.blind")
        let stunned = getProperty(update, "data.attributes.conditions.stunned")
        let poisoned = getProperty(update, "data.attributes.conditions.poisoned")
        let paralyzed = getProperty(update, "data.attributes.conditions.paralyzed")
        let petrified = getProperty(update, "data.attributes.conditions.petrified")
        if (blind === true) {
            ConAutoPF1.blindApplyActor(actor)
        }
        else if (blind === false) {
            ConAutoPF1.blindRemoveActor(actor)
        }
        let token = actor.getActiveTokens()[0]
        if(stunned !== undefined) ConAuto.stunned(token)
        if(poisoned !== undefined) ConAuto.poisoned(token)
        if(paralyzed !== undefined) ConAuto.paralyzed(token)
        if(petrified  !== undefined) ConAuto.petrified(token)
    })

    Hooks.on("preUpdateToken", (token, update) => {
        if (game.settings.get('condition-automation', 'npcVision') === false) return;
        const blindedSetting = game.settings.get('condition-automation', 'Blinded');
        let blind = getProperty(update, "actorData.data.attributes.conditions.blind")
        if (blind === undefined) return;
        let tokenInstance = canvas.tokens.get(token.id)
        if (blind) {
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
        if (!blind) {
            switch (blindedSetting) {
                case 1: {
                    let visionArc = tokenInstance.getFlag('condition-automation', 'sightAngleOld')
                    update.sightAngle = visionArc;
                    tokenInstance.unsetFlag('condition-automation', 'sightAngleOld')
                }
                    break;
                case 2: {
                    update.vision = true;
                }
                    break;
                case 3: {
                    let oldVision = tokenInstance.getFlag('condition-automation', 'PVold');
                    if (typeof oldVision !== 'number') oldVision = ""
                    tokenInstance.setFlag('perfect-vision', 'sightLimit', oldVision);
                    tokenInstance.unsetFlag('condition-automation', 'PVold');
                }
                    break;
            }
        }
    })
}