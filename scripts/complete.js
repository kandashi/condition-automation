Hooks.once('init', () => {
    let BlindCondition;
    switch (game.system.id) {
        case "dnd5e":
        case "pf2e":
            BlindCondition = "Blind";
            break;
        case "tormenta20":
            BlindCondition = "Cego";
            break;
    }

    game.settings.register('condition-automation', 'Blinded', {
        name: game.i18n.localize("CONDITION-AUTOMATION.BlindingSettingTitle"),
        scope: 'world',
        type: Number,
        default: 0,
        config: true,
        hint: game.i18n.localize("CONDITION-AUTOMATION.BlindingSettingHint"),
        choices: {
            0: game.i18n.localize("CONDITION-AUTOMATION.BlindingSettingOption0"),
            1: game.i18n.localize("CONDITION-AUTOMATION.BlindingSettingOption1"),
            2: game.i18n.localize("CONDITION-AUTOMATION.BlindingSettingOption2"),
            3: game.i18n.localize("CONDITION-AUTOMATION.BlindingSettingOption3")
        },
        onChange: () => {
            if (game.settings.get('condition-automation', 'Blinded') === 3 && !game.modules.get("perfect-vision")?.active && game.settings.get('condition-automation', 'shadows')) {
                ui.notifications.error(game.i18n.localize("CONDITION-AUTOMATION.condition-automationError"))
            }
        }
    });
    if (game.system.id === "dnd5e" || game.system.id === "pf2e") {
        game.settings.register('condition-automation', 'BlindStatus',
            {
                name: game.i18n.localize("CONDITION-AUTOMATION.BlindStatusTitle"),
                hint: game.i18n.localize("CONDITION-AUTOMATION.BlindStatusHint"),
                scope: "world",
                config: true,
                default: BlindCondition,
                type: String,
            });
    }
    game.settings.register('condition-automation', 'npcVision', {
        name: game.i18n.localize("CONDITION-AUTOMATION.npcVisionTitle"),
        scope: 'world',
        type: Boolean,
        default: false,
        config: true,
        hint: game.i18n.localize("CONDITION-AUTOMATION.npcVisionHint"),
    });
    game.settings.register('condition-automation', 'shadows', {
        name: game.i18n.localize("CONDITION-AUTOMATION.shadowsTitle"),
        scope: 'world',
        type: String,
        default: "off",
        choices: {
            "off": game.i18n.localize("CONDITION-AUTOMATION.shadowsSetting1"),
            "shadow": game.i18n.localize("CONDITION-AUTOMATION.shadowsSetting2"),
            "bulge": game.i18n.localize("CONDITION-AUTOMATION.shadowsSetting3"),
        },
        config: true,
        hint: game.i18n.localize("CONDITION-AUTOMATION.shadowsHint"),
        onChange: () => {
            if (!game.modules.get("tokenmagic")?.active && game.settings.get('condition-automation', 'shadows')) {
                ui.notifications.error(game.i18n.localize("CONDITION-AUTOMATION.shadowsError"))
            }
        },
    });
    game.settings.register('condition-automation', 'deadMacro', {
        name: game.i18n.localize("CONDITION-AUTOMATION.deadMacroName"),
        hint: game.i18n.localize("CONDITION-AUTOMATION.deadMacroHint"),
        type: String,
        default: "",
        config: true,
        scope: 'world'
    })
    game.settings.register('condition-automation', 'poisonedMacro', {
        name: game.i18n.localize("CONDITION-AUTOMATION.poisonedMacroName"),
        hint: game.i18n.localize("CONDITION-AUTOMATION.poisonedMacroHint"),
        type: String,
        default: "",
        config: true,
        scope: 'world'
    })
    game.settings.register('condition-automation', 'stunnedMacro', {
        name: game.i18n.localize("CONDITION-AUTOMATION.stunnedMacroName"),
        hint: game.i18n.localize("CONDITION-AUTOMATION.stunnedMacroHint"),
        type: String,
        default: "",
        config: true,
        scope: 'world'
    })
    game.settings.register('condition-automation', 'paralyzedMacro', {
        name: game.i18n.localize("CONDITION-AUTOMATION.paralyzedMacroName"),
        hint: game.i18n.localize("CONDITION-AUTOMATION.paralyzedMacroHint"),
        type: String,
        default: "",
        config: true,
        scope: 'world'
    })
    game.settings.register('condition-automation', 'petrifiedMacro', {
        name: game.i18n.localize("CONDITION-AUTOMATION.petrifiedMacroName"),
        hint: game.i18n.localize("CONDITION-AUTOMATION.petrifiedMacroHint"),
        type: String,
        default: "",
        config: true,
        scope: 'world'
    })
});

console.log("ConditionsV2.2.6 active");

Hooks.on("ready", () => {
    if (!game.user === game.users.find((u) => u.isGM && u.active)) return;
    if (game.system.id === "dnd5e" || game.system.id === "tormenta20") {
        CAHandleDnD5()
    }

    if (game.system.id === "pf2e") {
        CAHandlepf2()
    }

    if (game.system.id === "pf1") {
        CAHandlePf1()
    }
});

Hooks.on("preUpdateToken", async (token, updateData) => {

    const shadowSetting = game.settings.get('condition-automation', 'shadows');
    const elevation = getProperty(updateData, "elevation");
    let systemPath = ConAuto.systemPaths()
    const hp = getProperty(updateData, systemPath.HP)
    if (elevation !== undefined && shadowSetting !== "off") ConAuto.shadowEffect(token.id, elevation)
    if (hp === 0 && game.settings.get('condition-automation', 'deadMacro') !== "") ConAuto.deathEffect(token._id)

});







