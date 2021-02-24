# Blindness
Condition Automation will automatically adjust token vision settings to more closely represent Blindness. Configurable settings from removing vision entirely, reducing sight angle to 1 degree or using the Perfect Vivsion module to restrict vision to 0 feet.


## Shadows
This also includes automatic shadow creation for token elevation. This section requires Token Magic Fx to function. Changing the elevation of a token over 5ft will automaticly set a shadow effect "below" the token, this is change in distance based on the elevation value. 

![Shadow Effects](https://github.com/kandashi/condition-automation/blob/master/Images/ShadowEffects.PNG)
 
https://foundryvtt.com/packages/tokenmagic/


Many thanks to Forien for guiding me through this module, his patreon is here: https://www.patreon.com/forien

**V1.0.7** Shadow effects updated with "blulge" effect to help show token height, alonside the shadow. Working to query "flying" state before adding shadow effects.

**V1.1.2** Updated Shadow Effects to fall inline with Token Magic FX new system. Updated bulge effects to scale with elevation, alongside the shadow blur increasing with elevation too.

**V1.1.3**
Updated the conditions to include Paralyzed as an option, thanks to https://github.com/Takryn for bringing this up.

Also included image type independance, now any svg, png, webp or jpg willl register as a valid effect trigger; thanks to https://github.com/dstein766. However this does require the name of the effect to tie into the effect name; you must have the name as the linked status effect for it to register. E.g. eye.png will not registed the blinded condition, but blinded.webp will. The effects are as follows:

* petrified
* incapacitated
* restrained
* grappeled
* stunned
* unconscious
* blinded
* exhaustion 1-5
* prone
For some reason, the default conditions in DnD5e are not recognised.

**V2.0.0**
-Ripped out support for speed changes as this is now supported in the CUB default condition system
Reworked the blinded setting to properly recognise all Effects not only CUB ones. Now can designate a specific -Effect to trigger the Blind condition
- Changed config settings to stop collision with the Jitsi Module

**V2.1.0**
- Added options for Remove Vision from blinded tokens (take care to instruct your players how to reselect their tokens), and also added option to reduce Sight Limit to 0 for those using Perfect Vision

**V2.2.0**
- Added support for PF2e 
- Cleaned up old code to enhance performance

**V2.2.4** 
- Added support for Tormenta (thanks to @mclemente)
- Added spanish translation (thanks to @mclemente)

**V2.2.5**
- Added PF1 support
- Reworked shadow effects to filter out the "bulge" effect as an option