class ConAutoPF2 {

    static blindApplyActor(actor, token){
        const blindedSetting = game.settings.get('condition-automation', 'Blinded');
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

    static blindRemoveActor(actor, token){
        const blindedSetting = game.settings.get('condition-automation', 'Blinded');
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

function CAHandlepf2() {
    const itemName = game.settings.get('condition-automation', 'BlindStatus')
    Hooks.on("preUpdateToken", (token, update) => {
        if (game.settings.get('condition-automation', 'npcVision') === false) return;

        if (!update.actorData?.items) return;
        let tokenInstance = canvas.tokens.get(token.id)
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

    Hooks.on("createItem", (item, test) => {
        let document = item.parent
        if (item.type === 'condition' && item.data.flags[game.system.id]?.condition && item.name === `${itemName}`) {
            let token;
            if(document.data.token.actorLink){
            token = document.getActiveTokens()[0]
            }
            else {
                token = canvas.tokens.get(document.id)
            }
            const blinded = document.getFlag('condition-automation', 'sight')
            if (!blinded) {
                ConAutoPF2.blindApplyActor(document, token)
            }
        }
        if (item.type === 'condition' && item.data.flags[game.system.id]?.condition && item.name === game.i18n.format("PF2E.ConditionTypeSickened")) {
            ConAuto.poisoned(document.getActiveTokens()[0])
        }
        if (item.type === 'condition' && item.data.flags[game.system.id]?.condition && item.name === game.i18n.format("PF2E.ConditionTypeStunned")) {
            ConAuto.stunned(document.getActiveTokens()[0])
        }
        if (item.type === 'condition' && item.data.flags[game.system.id]?.condition && item.name === game.i18n.format("PF2E.ConditionTypePetrified")) {
            ConAuto.petrified(document.getActiveTokens()[0])
        }
        if (item.type === 'condition' && item.data.flags[game.system.id]?.condition && item.name === game.i18n.format("PF2E.ConditionTypeParalyzed")) {
            ConAuto.paralyzed(document.getActiveTokens()[0])
        }
    });

    Hooks.on("deleteItem", (item, test) => {
        let actor = item.parent
        if (item.type === 'condition' && item.data.flags[game.system.id]?.condition && item.name === `${itemName}`) {
            const token = actor.getActiveTokens()[0]
            const blinded = actor.getFlag('condition-automation', 'sight')
            if (blinded) {
                ConAutoPF2.blindRemoveActor(actor, token)
            }
        }
        if (item.type === 'condition' && item.data.flags[game.system.id]?.condition && item.name === game.i18n.format("PF2E.ConditionTypeSickened")) {
            ConAuto.poisoned(actor.getActiveTokens()[0])
        }
        if (item.type === 'condition' && item.data.flags[game.system.id]?.condition && item.name === game.i18n.format("PF2E.ConditionTypeStunned")) {
            ConAuto.stunned(actor.getActiveTokens()[0])
        }
        if (item.type === 'condition' && item.data.flags[game.system.id]?.condition && item.name === game.i18n.format("PF2E.ConditionTypePetrified")) {
            ConAuto.petrified(actor.getActiveTokens()[0])
        }
        if (item.type === 'condition' && item.data.flags[game.system.id]?.condition && item.name === game.i18n.format("PF2E.ConditionTypeParalyzed")) {
            ConAuto.paralyzed(actor.getActiveTokens()[0])
        }
    })
}