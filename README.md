# SFMC-Profile-Subscription-Center
SFMC-Profile/Subscription Center

How to build Custom SFMC Profile/Subscription Center?

- AMP Script
- SSJS
- Cloud Pages

1. Create Microsite for our center.
2. Create those pages:
  * Profile Center
  * Subscription Center
  * Home Page (default)
  * One-Click Unsubscribe Page
3. Write NOTHING in Cloud Pages (atleast while debugging)
4. Create code snippet in Content Builder for every page.
5. Paste this function with corresponding code snippet on each page 
    - ``` %%=ContentBlockbyKey("code-snippet-from-content-builder-key")=%% ```
    
Great, now you are able to debugg in real-time isntead waiting infinity before Cloud Page would refresh itself.

Necessary code snippets in the repository.

Enjoy

