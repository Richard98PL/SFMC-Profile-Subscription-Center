# SFMC-Profile-Subscription-Center
SFMC-Profile/Subscription Center

How to build Custom SFMC Profile/Subscription Center?


What do you need to know?
- AMP Script
- SSJS
- Cloud Pages

Choose between two scenarios about keeping user data
- Subscriber Lists, Profile Attributes, Preferences
- Data Extesnsion


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
 - Hack MC and still include required links in emails
    - ``` %%[ if 0 == 1 then ]%%%%profile_center_url%%%%[endif]%%```
    - ``` %%[ if 0 == 1 then ]%%%%subscription_center_url%%%%[endif]%%```
    - ``` %%[ if 0 == 1 then ]%%%%unsub_center_url%%%%[endif]%%```
 - Include email as a URL Parameter, but hash it and then Base64Encode to avoid wrong ASCII chars in parameter
   
Great, now you are able to debugg in real-time isntead waiting infinity before Cloud Page would refresh itself.

Necessary code in WIKI or in repository.

Enjoy
