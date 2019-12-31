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

Code with comments and tips in repository.

Enjoy

* Site Necessary Code
```
<nav>
  %%[
      SET @subscriptionCenterPageURL = CloudPagesURL(subscriptionNumber)
      SET @profileCenterPageURL = CloudPagesURL(profileNumber)
      SET @homePageURL = CloudPagesURL(homePageNumber)

      IF EMPTY(RequestParameter('email')) THEN
        Redirect(@homePageUrl)
      ELSE
        SET @salt = "e0cf1267f564b362" // 16 HEX Chars
        SET @password = "ourPassword" // String
        SET @initVector = "4963b7334a46352623252955df21d7f3" // 32 HEX Chars
        
        SET @emailDecryptedNotDecoded = RequestParameter('email')
        SET @emailDecrypted = DecryptSymmetric(Base64Decode(RequestParameter('email')), 
         "tripledes;mode=ecb;padding=ansix923", 
          @null, @password, 
          @null, @salt, 
          @null, @initVector
        )
      ENDIF
  ]%%
 <a href="%%=Concat(RedirectTo(@subscriptionCenterPageURL),'?email=',RequestParameter('email'))=%%">Subs Center Page</a>
 <a href="%%=Concat(RedirectTo(@profileCenterPageURL),'?email=',RequestParameter('email'))=%%">Profile Center Page</a>
</nav>
 
<head>
 <link rel="stylesheet" type="text/css" href="%%=CloudPagesURL(ourCssFileNumber)=%%">
 <script src="%%=CloudPagesURL(ourJSScriptNumber)=%%"></script>  
</head>
```

* SSJS Template
```
<script type="text/javascript" runat="server">
   Platform.Load("core", "1");
   var email = Variable.GetValue("@amp_email");
</script>
```

* SUBSCRIBER BASED SCENARIO
  - HTML Preference
    ```
     var results = Subscriber.Retrieve({Property:"EmailAddress",SimpleOperator:"equals",Value:email});
     var emailTypePreference = results[0]["EmailTypePreference"]; 
    ```

  - Attributes Retrieve
    ```
    var subscriber_object = Subscriber.Init(email);
    var attributes = subscriber_object.Attributes.Retrieve();
 
    for(var i = 0; i<attributes.length; i++){
      if(attributes[i].Name === "First Name"){
       var firstName = attributes[i].Value;
      }
      if(attributes[i].Name === "Preference 1"){
        var firstName = attributes[i].Value;
       }
    } 
    ```

  - Lists Retrieve
    ```
    var subscriber_object = Subscriber.Init(email);
    var lists = subscriber_object.Lists.Retrieve();

    for(var i = 0; i < lists.length ; i++){
      if(lists[i]["List"]["Name"] === "All Subscribers"){ 
         if(lists[i]["Status"] == "Active"){ //"Active"/"Unsubscribed"
           //... logic here
         }
      }
    }
    ```

  - Attributes Update
    ```
    var data = { 
                 "EmailTypePreference": emailTypePreference,
                 "Attributes": { 
                               "First Name": firstName,               
                               "Last Name":  lastName
                               }  
              }

    var subscriber_object = Subscriber.Init(email);
    var status = subscriber_object.Update(data);
    ```

  - All Subscribers Unsubscribe
    ```
    var subscriber_object = Subscriber.Init(email);
    var status = subscriber_object.Remove();
    ```

  - Custom List Unsubscribe
    ```
    var myList = List.Init("ListKey");
    var status = myList.Subscribers.Unsubscribe(email);
    ```
  
  - Custom List Subscribe
    ```
    var myList = List.Init("ListKey");
    var status = myList.Subscribers.Upsert(email);
    ```

* DATA EXTENSION SCENARIO
 
  - Data Extension Columns Retrieve
    ```
    var dataRows = Platform.Function.LookupOrderedRows("dataExtensionName",1,"Email desc","Email",email);
    var id = dataRows[0]["Id"];
    var firstName = dataRows[0]["FirstName"];
    var lastName = dataRows[0]["LastName"];
    var email = dataRows[0]["Email"];
    var preference1 = dataRows[0]["Preference1"];
    ```

  - Data Extension Columns Update
    ```
    var dataRows = Platform.Function.LookupOrderedRows("dataExtensionName",1,"Email desc","Email",email);
    var id = dataRows[0]["Id"];
    var fields = ["FirstName","LastName","Email","Preference1"];
    var values = [firstName,lastName,email];
 
    var result =  Platform.Function.UpdateData("dataExtensionName",["Id"],[id],fields,values); 
    ```

* FORM

  - Form Tag
    ```
    <form method="POST" action="%%=Concat(RedirectTo(@ProfileCenterPageURL),'?email=',RequestParameter('email'))=%%">
    ```

  - Form Text Field
    ```
    <input name="first_name" required type="text" value="<ctrl:var name=firstName default=0/>">
    ```
  
  - Form Select Field
    ```
    <select name="country">

      %%[ SET @country= "" ]%%
      <script type="text/javascript" runat="server"> Variable.SetValue("@country",js_country) </script>

      <option value="Poland" %%=IIF(@country=='Poland','selected','')=%%>Poland</option>
      <option value="Germany" %%=IIF(@country=='Germany','selected','')=%%>Germany</option>
      <option value="Russia" %%=IIF(@country=='Russia','selected','')=%%>Russia</option>

    </select>
     ```

  - Form Checkbox Field
   ```
   <input id="all_subscribers" name="all_subscribers" type="checkbox" <ctrl:var name=allSubscribersCheckbox/>  >
   //<ctrl:var> tag set to "checked" or null
   ```


  
   





