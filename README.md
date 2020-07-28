# Conditons
Automated Conditions Foundry VTT
This module requires Combat Utility Belt for basic fuctionality 
It will automaticly set speed and vision on the actor token based on the CUB effects present on the actor.
These effects work well alongside About-Time and Dynamic Effects for auto-application. 
https://foundryvtt.com/packages/combat-utility-belt/

Upon aplication of the CUB conditions for: Blinded, Stunned, Petrified, Grappled, Restrained, Unconsious, Incapacitiated, Exhaustion 1-5; the revlavent adjustments will be made to the actor/token data. Vision will be dissabled on Blinded tokens, and speed reduced on the others. 
These changes are non-permenant and will revert upon removal of the status effect.

https://s7.gifyu.com/images/Speed-Tests.gif

This also includes automatic shadow creation for token elevation. This section requires Token Magic Fx to function. Changing the elevation of a token over 5ft will automaticly set a shadow effect "below" the token, this is change in distance based on the elevation value. There is a slight issue pending that these will not reset properly with a restart. This will be worked on but for now, use the Delete on Selected macro for Token Magic FX.
https://foundryvtt.com/packages/tokenmagic/

Many thanks to Forien (https://github.com/Forien) for guiding me through this module, his patreon is here: https://www.patreon.com/forien/posts
