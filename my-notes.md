 * react native once again and
  --try and use the connectED app
    --to create the UI elements for the Oviedo mall app
      -- as shown in the attached video.

 * You can begin with the initial home panel with events.

 * It mimics connectED to reduce development time and is something we would actually like to use for production if your work comes out nicely.

 * Dont forget to track on Asana

files to use:
  --/components/EventListCard.js  creates each event on the Events page
  --/components/EventsHomeScreen.js
  --/
  --where is bottom main navbar??????

* Find past files change via `connectED-React-Frontend-Production]💀  ☭(oviedo-mall-ui-home-panel)➤ git log --name-only`
* FILES WORKED ON:
                  screens/CalendarHomeScreen.js

                  constants/Colors.js <--Good for now, matches Mall mockup>
                  node_modules/react-navigation-tabs/src/views/BottomTabBar.js
                  node_modules/react-native-elements/src/config/colors.js
                  node_modules/react-native-elements/src/buttons/ButtonGroup.js
                  components/TabBarIcon.js

* So Far:
        -  /components/EventListCard.js --> MallEventListCard.js
        -  /screens/EventScreen.js --> MallEventScreen.js
        -  /screens/EventsHomeScreen.js --> MallEventsHomeScreen.js
        - components/TabBarIcon.js
        - node_modules/react-navigation-tabs/src/views/BottomTabBar.js

* Wire Frame out the entire Events page to get what should be where & styles
  -- black backgroundColor: #09070ab3 ??

* Can check git logs to see where the backgroundColors were changed to blue for the Calendar mockup!

* Create a new Events screen file for the Mall

* Find where the current Events screen is called from & then switch it out w/ the Mall Events screen

* Will have to make a mock DB like I did w/ the /screens/CalendarHomeScreen.js mockup
 eventItems: [
   { title: 'Launch Event', company: 'ViewStub', date: 'June 14'},
   { title: 'Launch Event', company: 'ViewStub', date: 'June 14'},
   { title: 'Launch Event', company: 'ViewStub', date: 'June 14'}
 ]



Monday 6/3/19:
BUG:
          VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. Object {
            "contentLength": 17640,
            "dt": 601,
            "prevDt": 1851,
          }


Button Group appears to have a universal style for the
app which is overriding any styles added in the caledarhomescreen.js file

Buttons have 2 different states,
  selected
  not-selected

need to target each one.





*** Where are the styles At?!
  usually in each component or screen file

*** Where is the routing At!?
  -Found the fuker! Is done via react-navigation installed w/
  package.json


/*******************************************************/
**In the new React Developer tools via CLI
`adb reverse tcp:8097 tcp:8097`
`npm run react-devtools`

run, launch it, then do the `ctrl+i`
/*******************************************************`
To run Remote JS Debugging w/ the debugger-ui in a chrome tab:
  run expo w/ production mode: OFF
  connection: local
  on the emulator phone hit `CTRL + M`



<RCTText testID="buttonGroupItemText" ></RCTText>

{
  "style": {
    "fontFamily": "sans-serif",
    "fontSize": 13,
    "color": "#5e6977"
  },
  "testID": "buttonGroupItemText",
  "theme": {
    "colors": {
      "primary": "#2089dc",
      "secondary": "#8F0CE8",
      "grey0": "#393e42",
      "grey1": "#43484d",
      "grey2": "#5e6977",
      "grey3": "#86939e",
      "grey4": "#bdc6cf",
      "grey5": "#e1e8ee",
      "greyOutline": "#bbb",
      "searchBg": "#303337",
      "success": "#52c41a",
      "error": "#ff190c",
      "warning": "#faad14",
      "disabled": "hsl(208, 8%, 90%)",
      "divider": "#bcbbc1",
      "platform": {
        "ios": {
          "primary": "#007aff",
          "secondary": "#5856d6",
          "success": "#4cd964",
          "error": "#ff3b30",
          "warning": "#ffcc00"
        },
        "android": {
          "primary": "#2196f3",
          "secondary": "#9C27B0",
          "success": "#4caf50",
          "error": "#f44336",
          "warning": "#ffeb3b"
        }
      }
    }
  },
  "forwardedRef": null,
  "accessible": true,
  "allowFontScaling": true,
  "ellipsizeMode": "tail"
}


FILES WORKED ON connectED app CalendarHomeScreen Mockup:
  screens/CalendarHomeScreen.js
  constants/Colors.js
  node_modules/react-navigation-tabs/src/views/BottomTabBar.js
  node_modules/react-native-elements/src/config/colors.js
  node_modules/react-native-elements/src/buttons/ButtonGroup.js
  components/TabBarIcon.js


FILES WORKED ON connectED app Oviedo Mall Mockup:








# React Native Tips:
* **border: 1px solid red would instead be described explicitly, like { borderWidth: 1, borderColor: 'red' }.**




6/12/19:

/NeoWare_All/connectED-React-Frontend-Production/node_modules/react-native/Libraries/Components/ScrollView/ScrollView.js:991
  ^--changed backgroundColor: #111

/components/TabBarIcon.js  <--changed backgroundColor: #111 >

/  node_modules/react-navigation-tabs/src/views/BottomTabBar.js  <--changed backgroundColor: #111 >

/home/sofa_king/NeoWare_All/connectED-React-Frontend-Production/node_modules/react-native/Libraries/Text/Text.js:145
^--
style {
  fontSize: 47;
  color: #000;
  fontWeight: 'bold';
  paddingHorizontal: 12;
}
CHANGE TO:
style {
  fontSize: 30;
  color: #fff;
  paddingHorizontal: 57;
}

/home/sofa_king/NeoWare_All/connectED-React-Frontend-Production/node_modules/react-native/Libraries/Text/Text.js:268
^--
style {
  fontSize: 50;
}


/home/sofa_king/NeoWare_All/connectED-React-Frontend-Production/node_modules/react-native/Libraries/Lists/VirtualizedList.js:687
^---


*** Might be ideal to put all custom styles into the /constants/Styles.js file and just add custom classes to all components needed to match the Mall mockup.

6/13/19:

In /EventsHomeScreen.js:
// Adds the png but places it on top of the <ScrollView></ScrollView> component
<Image source={require('../assets/images/eventViewStub.png')} style={[styles.image, { width: screenWidth }]} />

url: "http://www.arnold.fun/50/50"
http://www.arnold.fun/12a/50/50



6/17/19:
========
Files worked on:

  * /components/EventListCard.js
    -changed  styles in the <Card> component to remove #fff background on each Card.
              backgroundColor: 'transparent', // mockup
              borderWidth: 0,

  * /navigation/ProfileTabs.js
    -changed the tabBarLabels to empty sting value to match Mall mockup
    tabBarLabels: " ",  // "Events", changed for Oviedo Mall Mockup


6/18/19:
========
  Files worked on:

  * /navigation/ProfileTabs.js
    -commented out the bottam tab bar icons, replaced them w/ Mall mockup png's

  * /EventDetails.js
    -changed OM Icons dir name to remove white space & in require()

  * /EventsHomeScreen.js
    line 60 - added gear icon to upper right corner
    line 425 - removed circle plus icon from upper left corner by making backgroundColor transparent
    line 415- style={{}} modified user image in upper left corner

  * /EventListCard.js
    line 56 - added 'LAUNCH EVENT', 'VIEWSTUB' labels & circle w/ date 'July 14' to the EventListCard.js 
    TODO: position above components to match Mall mockup
    
    IDEA: check out the original connectED app in emulator, the events screen has text labels on top of the event image
can copy that code. 
     EventListCard.js line 177 is start of the Text component for the Month & Day listed on Card



** USE THIS CODE SNIPPET**
// GOOD
var icon = this.props.active
  ? require('./my-icon-active.png')
  : require('./my-icon-inactive.png');
<Image source={icon} />;



// IDEA: 
        create a new React component to mockup the entire Event Screen
        do not use Icon component
        might work with <View> <Image/>
        