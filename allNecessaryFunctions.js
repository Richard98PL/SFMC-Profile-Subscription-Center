<script type="text/javascript" runat="server"> //It is SSJS so must use runat="server"
 
 
   // !-- INCLUDE IT IN EVERY SCRIPT --! //
 
    Platform.Load("core", "1"); //Load platform Core Library to avoid using Platform.Core.FunctionName everywhere

    var email = Variable.GetValue("@amp_email"); //you must decrypt and decode email parameter in AMP Script and that's way to get it in JS from AMP Script.

    Variable.SetValue("@amp_email","example@gmail.com");  //You can also set AMPScript value

  // !-- ENDOF INCLUDE IT IN EVERY SCRIPT --! //








    // !-- SUBSCRIBER BASED SCENARIO --! //

    var results = Subscriber.Retrieve({Property:"EmailAddress",SimpleOperator:"equals",Value:email}); //retieving subscriber Object (just to get HTMLPreference field which is preference but Attributes() doesn't return it.)

    var emailTypePreference = results[0]["EmailTypePreference"]; //Necessary to obtain just EmailTypePreference which can be "HTML"/"Text"

    if (Request.Method == "POST"){ } // condition to execute after form submission
    var formField = Request.GetFormField("formFieldName"); // obtaining form fields values
    
    var data = { // JSO to for updating SUBSCRIBER's attributes
                  "EmailTypePreference": s_emailTypePreference,
                  "Attributes": { 
                                "First Name": Request.GetFormField("first_name"),               
                                "Last Name":  Request.GetFormField("last_name")
                                }  
               }

    var subscriber_object = Subscriber.Init(email); // initializing SUBSCRIBER object
    var status = subscriber_object.Update(data); // function Update on SUBSCRIBER object sending data JSO
    
    var subscriber_object = Subscriber.Init(email); // initializing SUBSCRIBER object AFTER UPDATE to gain current data
    var attributes = subscriber_object.Attributes.Retrieve(); //retreiving Subscriber Attributes () also Preferences
  
    for(var i = 0; i<attributes.length; i++){ //looping on attributes response to access certain fields
      if(attributes[i].Name === "First Name"){
       var firstName = attributes[i].Value;
      }
      if(attributes[i].Name === "Preference 1"){
        var firstName = attributes[i].Value;
       }
    } 

    var subscriber_object = Subscriber.Init(email);
    var lists = subscriber_object.Lists.Retrieve(); //Retreiving lists of certain subscriber

    for(var i = 0; i < lists.length ; i++){ //looping on lists to access certain lists 
       if(lists[i]["List"]["Name"] === "All Subscribers"){ 
          if(lists[i]["Status"] == "Active"){ //status can be "Active"/"Unsubscribed"
            //... logic here
          }
       }
     }
     
    var myList = List.Init("ListKey"); //Initializing List object
    var status = myList.Subscribers.Unsubscribe(email); //Remove from myList
    var status = myList.Subscribers.Upsert(email); //Adding someone to myList


    var subscriber_object = Subscriber.Init(email);
    var status = subscriber_object.Remove(); //removing from All Subscribers
    // you can't add someone to All Subscribers. Person is automatically added after email send or subscribing to other lists.

    // !-- ENDOF SUBSCRIBER BASED SCENARIO --! //








    // !---DATA EXTENSION BASED SCENARIO --! //
    var dataRows = Platform.Function.LookupOrderedRows("dataExtensionName",1,"Email desc","Email",email); //where email = our_email;
    var id = dataRows[0]["Id"]; //Retrieving fields from DataExtension
    var firstName = dataRows[0]["FirstName"];
    var lastName = dataRows[0]["LastName"];
    var email = dataRows[0]["Email"];
    var preference1 = dataRows[0]["Preference1"];

    var fields = ["FirstName","LastName","Email","Preference1"];
    var values = [firstName,lastName,email];
  
    var result =  Platform.Function.UpdateData("dataExtensionName",["Id"],[id],fields,values); //updating dataExtension, PK is ID :)
                                                                                               // Remember we need PK since DE is SQL

    //and yup that's pretty all of DE logic..

    // !---ENDOF DATA EXTENSION BASED SCENARIO --! //









    // !--NAV AND HEADER FOR OUR MICROSITES --! //
  
   <nav>
        %%[
            SET @SubscriptionCenterPageURL = CloudPagesURL(subscriptionNumber)
            SET @ProfileCenterPageURL = CloudPagesURL(profileNumber)
            SET @HomePageURL = CloudPagesURL(homePageNumber)

            IF EMPTY(RequestParameter('email')) THEN
              Redirect(@HomePageUrl)
            ELSE
              set @salt = "e0cf1267f564b362" // REMEMBER ONLY HEX VALUES! 8 BYTES! So 16 chars. One HEX DUET = 1 BYTE
              set @password = "ourPassword" //our password String
              set @initVector = "4963b7334a46352623252955df21d7f3" //HEX VALUES 16 BYTES! 32 chars.
              
              set @EmailDecryptedNotDecoded = RequestParameter('email')
              SET @EmailDecrypted = DecryptSymmetric(Base64Decode(RequestParameter('email')), "tripledes;mode=ecb;padding=ansix923", @null, @password, @null, @salt, @null, @initVector)
            ENDIF
        ]%%
      <a href="%%=Concat(RedirectTo(@SubscriptionCenterPageURL),'?email=',RequestParameter('email'))=%%">Subscription Center Page</a>
      <a href="%%=Concat(RedirectTo(@ProfileCenterPageURL),'?email=',RequestParameter('email'))=%%">Profile Center Page</a>
    </nav>
  
<head>
  <link rel="stylesheet" type="text/css" href="%%=CloudPagesURL(ourCssFileNumber)=%%">
  <script src="%%=CloudPagesURL(ourJSScriptNumber)=%%"></script>  
</head>

// !-- ENDOF NAV AND HEADER FOR OUR MICROSITES --! //










// !-- FORM BUILDING WITH SSJS --! //


<form method="POST" action="%%=Concat(RedirectTo(@ProfileCenterPageURL),'?email=',RequestParameter('email'))=%%">

  <table>
      
    <tr> //text field example
     <td>First Name</td>
        <td><input name="first_name" required type="text" value="<ctrl:var name=firstName default=0/>"></td>
       </tr>

       <tr> //select with default values based on subscriber fields/data extension columns 
        <td>Country</td>
        <td>
          <select name="country">

            %%[ SET @country= "" ]%%
            <script type="text/javascript" runat="server"> Variable.SetValue("@country",js_country) </script>

            <option value="Poland" %%=IIF(@country=='Poland','selected','')=%%>Poland</option>
            <option value="Germany" %%=IIF(@country=='Germany','selected','')=%%>Germany</option>
            <option value="Russia" %%=IIF(@country=='Russia','selected','')=%%>Russia</option>

          </select>
        </td>
      </tr>
        
      <tr>
        <td">All Subscribers</td> //checkbox example
            <td><input id="all_subscribers" name="all_subscribers" type="checkbox" onclick="allSubsFunction(this)" <ctrl:var name=allSubscribersCheckbox/>  ></td>
            //we have to set this ->^<- value for string "checked" in order to have checkbox ticked
      </tr>  
</form>

// !-- ENDOF FORM BUILDING WITH SSJS --! //
