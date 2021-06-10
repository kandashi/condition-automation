class ConAutoDND {

    static blindApplyActor(actor) {
        const blindedSetting = game.settings.get('condition-automation', 'Blinded');
        let token = actor.getActiveTokens()[0]
        let actorToken = game.actors.get(actor.id)
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

    static blindRemoveActor(actor){
        const blindedSetting = game.settings.get('condition-automation', 'Blinded');
        let token = actor.getActiveTokens()[0]
        let actorToken = game.actors.get(actor.id)
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
}

function CAHandleDnD5() {
    Hooks.on("preCreateActiveEffect", (effects) => {
        const blindStatus = game.settings.get('condition-automation', 'BlindStatus');
        let blinded = effects.data.label === blindStatus;
        const poisoned = effects.data.label === game.i18n.format("DND5E.ConPoisoned")
        const stunned = effects.data.label === game.i18n.format("DND5E.ConStunned")
        const paralyzed = effects.data.label === game.i18n.format("DND5E.ConParalyzed")
        const petrified = effects.data.label === game.i18n.format("DND5E.ConPetrified")
        const actor = effects.parent
        if (blinded) {
            ConAutoDND.blindApplyActor(actor)
        }
        if(poisoned) {
            let token = actor.getActiveTokens()[0]
            ConAuto.poisoned(token)
        }
        if(stunned) {
            let token = actor.getActiveTokens()[0]
            ConAuto.stunned(token)
        }
        if(paralyzed) {
            let token = actor.getActiveTokens()[0]
            ConAuto.paralyzed(token)
        }
        if(petrified) {
            let token = actor.getActiveTokens()[0]
            ConAuto.petrified(token)
        }
    });

    Hooks.on("preDeleteActiveEffect", (effects) => {
        const blindStatus = game.settings.get('condition-automation', 'BlindStatus');
        let blinded = effects.data.label === blindStatus;
        const poisoned = effects.data.label === game.i18n.format("DND5E.ConPoisoned")
        const stunned = effects.data.label === game.i18n.format("DND5E.ConStunned")
        const paralyzed = effects.data.label === game.i18n.format("DND5E.ConParalyzed")
        const petrified = effects.data.label === game.i18n.format("DND5E.ConPetrified")
        const actor = effects.parent
        if (blinded) {
            ConAutoDND.blindRemoveActor(actor)
        }
        if(poisoned) {
            let token = actor.getActiveTokens()[0]
            ConAuto.poisoned(token)
        }
        if(stunned) {
            let token = actor.getActiveTokens()[0]
            ConAuto.stunned(token)
        }
        if(paralyzed) {
            let token = actor.getActiveTokens()[0]
            ConAuto.paralyzed(token)
        }
        if(petrified) {
            let token = actor.getActiveTokens()[0]
            ConAuto.petrified(token)
        }
    })

    Hooks.on("preUpdateToken", (token, update) => {
        if (game.settings.get('condition-automation', 'npcVision') === false) return;
        let tokenInstance = canvas.tokens.get(token.id)
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
        else if (!blinded && currentlyBlinded) {
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