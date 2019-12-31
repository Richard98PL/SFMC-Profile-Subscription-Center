# SFMC-Profile-Subscription-Center
SFMC-Profile/Subscription Center

How to build Custom SFMC Profile/Subscription Center?


what do you need to know?
- AMP Script
- SSJS
- Cloud Pages

Start like this:

- Create Microsite for our center.
- Create those pages:
  * Profile Center
  * Subscription Center
  * Home Page (default)
  * One-Click Unsubscribe Page
- Write NOTHING in Cloud Pages (atleast while debugging)
- Create code snippet in Content Builder for every page.
- Paste this function with corresponding code snippet on each page 
    - ``` %%=ContentBlockbyKey("code-snippet-from-content-builder-key")=%% ```
    
Great, now you are able to debugg in real-time isntead waiting infinity before Cloud Page would refresh itself.

Necessary code snippets in the repository.

Enjoy

