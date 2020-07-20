console.log("ConditionsV2 active");
Hooks.on("ready", function () {
    if (game.modules.get('combat-utility-belt')?.active) {
        console.log('CUB active');
        } else {
        ui.notifications.warn('Combat Utility Belt not active');
    }
});
const scope = 'condition-automation';
//no idea what this does :D
function getEffect(path) {
    const effectRegExp = new RegExp("([a-z-_]+)([0-9]+)?\.svg", 'i');
    let match = path.match(effectRegExp);
    if (!match) return undefined;

    let name = match[1];
    let level = match[2];

    return [name, level];
}
//these set the functions to be called on later by other functions
function getEffects(effects) {
    return effects.map(getEffect).filter(e => Array.isArray(e));
}

function getHighestEffect(effects, effect) {
    return Math.max(...(effects.filter(e => e[0] === effect).map(e => e[1])));
}

function hasEffect(effects, effect) {
    if (Array.isArray(effect)) {
        return effects.find(e => effect.includes(e[0])) ? true : false;
    }
    return effects.find(e => e[0] === effect) ? true : false;
}

function getNewSpeed(actor, effects, currentSpeed) {
    //lets other functions find any speed based effects without re-typing the entire string
    let speedEffects = ['petrified', 'incapacitated', 'restrained', 'grappled', 'stunned', 'unconscious'];
    let newSpeed = currentSpeed;

    //if effects present but no current reduction then store speed data and reduce to 0
    if (hasEffect(effects, speedEffects)) {
        return 0;
        //if effects not present and speed reduction is in place then replace speed and remove speed flag
        //im not sure how this works...
    }
    //this quereies the effetcs._ path to find if exhaustion is present in that string
    let hasExhaustion = hasEffect(effects, 'exhaustion');
    //this uses the above HighestEffect to find the highest count of exhaustion
    let exhaustionLevel = getHighestEffect(effects, 'exhaustion');
    //this tests if exhaustion is present, then "counts down" the cases to find the highest level and applies that effect
    if (hasExhaustion) {
        switch (exhaustionLevel) {
            case 5:
                return 0;
            case 4:
            case 3:
            case 2:
                newSpeed = newSpeed / 2;
                break;
            case 1:
            default:
        }
    }
    //uses the hasEffect function to query the list
    let hasProne = hasEffect(effects, 'prone');
    if (hasProne) {
        newSpeed = newSpeed / 2;
        //i could theortically call a macro here to perform another function too?
    }
    //if no prone then return back to newSpeed 
    return newSpeed;
    
}

Hooks.on("preUpdateToken", async (scene, token, updateData, options) => {
    let effects = getProperty(updateData, 'effects');
    if (!effects) return;
    //if no effects finish the if()

    const actor = game.actors.get(token.actorId);
    //shortens code in the future stuff
    effects = getEffects(effects);

    const blinded = hasEffect(effects, ['blind', 'blinded']);
    updateData.vision = !blinded;
    //this one i 100% understand

    let originalSpeed = actor.getFlag(scope, 'originalSpeed');
    //sets up a getFlag for unkown...?
    let hasOriginalSpeedFlag = !!originalSpeed;
    //sets hasOriginalSpeedFlag boolean from originalSpeed (so auto true as a string sets false then back to true?)

    let currentSpeed = parseInt(actor.data.data.attributes.speed.value);
    //sets currentSpeed as a interger of actor.speed
    if (!hasOriginalSpeedFlag) {
        originalSpeed = currentSpeed;
    }
    let newSpeed = getNewSpeed(actor, effects, originalSpeed);

    if (newSpeed !== currentSpeed) {
        await actor.update({ 'data.attributes.speed.value': `${newSpeed} ft` });
    }

    if (hasOriginalSpeedFlag && originalSpeed === newSpeed) {
        await actor.unsetFlag(scope, 'originalSpeed');
    } else {
        await actor.setFlag(scope, 'originalSpeed', originalSpeed);
        //these last 10 lines or so I have no idea :D
    }

    //testing
    let macroName = "D - Auto-Destroy Example";
    let hasStunned = hasEffect(effects, 'stunned');
    if (hasStunned) {
        const macro = game.macros.getName(macroName);
        if(macro) macro.execute();
        else ui.notifications.warn(`Macro "${maacroName}" not found.`);
    }
});