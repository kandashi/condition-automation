const config = [{
    name: 'Blinded',
    data: {
        name: 'Blinding Setting',
        scope: 'world',
        type: Boolean,
        default: false,
        config: true,
        onChange: (newValue) => {
            console.log(`Blinded Setting changed to ${newValue}.`)
        },
    },
},
{
    name: 'shadows',
    data: {
        name: 'Shadow Setting',
        scope: 'world',
        type: Boolean,
        default: false,
        config: true,
        onChange: (newValue) => {
            console.log(`Shadow Setting changed to ${newValue}.`)
        },
    }
}];

Hooks.once('init', () => {
    config.forEach((cfg) => {
        game.settings.register('condition-automation', cfg.name, cfg.data);
    });
});

console.log("ConditionsV1.0.7 active");
const scope = 'condition-automation';

function getEffect(path) {
    const effectRegExp = new RegExp("([a-z-_]+)([0-9]+)?\.svg", 'i');
    let match = path.match(effectRegExp);
    if (!match) return undefined;

    let name = match[1];
    let level = match[2];

    return [name, level];
}

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

/**
 * Calculates new speed based o
 *
 * @param {Array} effects
 * @param currentSpeed
 * @return {number}
 */
function getNewSpeed(effects, currentSpeed) {
    let newSpeed = currentSpeed;

    let speedEffects = ['petrified', 'incapacitated', 'restrained', 'grappled', 'stunned', 'unconscious', 'net', 'sleep', 'daze'];
    if (hasEffect(effects, speedEffects)) {
        return 0;
    }

    let hasExhaustion = hasEffect(effects, 'exhaustion');
    if (hasExhaustion) {
        let exhaustionLevel = getHighestEffect(effects, 'exhaustion');
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

    let hasProne = hasEffect(effects, 'prone');
    if (hasProne) {
        newSpeed = newSpeed / 2;
    }

    return newSpeed;
}

Hooks.on("preUpdateToken", async (scene, token, updateData, options) => {

        let effects = getProperty(updateData, 'effects');
    if (!effects) return;

    const actor = game.actors.get(token.actorId);
    effects = getEffects(effects);

    const blindedSetting = game.settings.get('condition-automation', 'Blinded');
    const blinded = hasEffect(effects, ['blind', 'blinded']);
    if (blinded && blindedSetting) {
        updateData.sightAngle = 1
    } else if (!blinded) {
        updateData.sightAngle = 0
    }

    let originalSpeed = actor.getFlag(scope, 'originalSpeed');
    const hasOriginalSpeedFlag = !!originalSpeed;

    let currentSpeed = parseInt(actor.data.data.attributes.speed.value);
    if (!hasOriginalSpeedFlag) {
        originalSpeed = currentSpeed;
    }

    let newSpeed = getNewSpeed(effects, originalSpeed);

    if (newSpeed !== currentSpeed) {
        await actor.update({ 'data.attributes.speed.value': `${newSpeed} ft` });
    }

    if (hasOriginalSpeedFlag && originalSpeed === newSpeed) {
        await actor.unsetFlag(scope, 'originalSpeed');
    } else {
        await actor.setFlag(scope, 'originalSpeed', originalSpeed);
    }

    //additions over standard
    let hasStunned = hasEffect(effects, 'stunned');
    if (hasStunned) {
        console.log(stunned);
        let params =
            [{
                filterType: "bevel",
                autoDestroy: true,
                rotation: 0,
                thickness: 6,
                lightColor: 0x00FF00,
                lightAlpha: 0.7,
                shadowColor: 0xFF0000,
                shadowAlpha: 0.4,
                animated:
                {
                    rotation:
                    {
                        active: true,
                        clockWise: true,
                        loopDuration: 1000,
                        animType: "chaoticOscillation",
                        loops: 2,
                        animType: "rotation"
                    }
                }
            }];

        TokenMagic.addFiltersOnTargeted(params);
    }
});

Hooks.on("preUpdateToken", async (scene, token, updateData, options) => {
    const shadowSetting = game.settings.get('condition-automation', 'shadows');
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