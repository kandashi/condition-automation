# Condition Management

## Blindness
Condition Automation will automatically adjust token vision settings to more closely represent Blindness. Configurable settings from removing vision entirely, reducing sight angle to 1 degree or using the Perfect Vision module to restrict vision to 0 feet.

## Other conditions

Paralyzed, Poisoned, Petrified and Stunned will all trigger a macro as named in the settings. The macro will be called with `arguments[0]` as the token that was effected; and `arguments[1]` as "on" or "off". This will only work for **Linked** tokens at the moment.

## Death macro

A macro can be triggered as a **unlinked** token reaches 0 hp. This is a one way macro and will not re-run if the token is healed.

# Shadows
This also includes automatic shadow creation for token elevation. This section requires Token Magic Fx to function. Changing the elevation of a token over 5ft will automaticly set a shadow effect "below" the token, this is change in distance based on the elevation value. 

![Shadow Effects](https://github.com/kandashi/condition-automation/blob/master/Images/ShadowEffects.PNG)
 
https://foundryvtt.com/packages/tokenmagic/


Many thanks to Forien for guiding me through this module, his patreon is here: https://www.patreon.com/forien