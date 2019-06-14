import User from "../components/User"


export default {
  /**
   * description: Checks user in or out of an event
   * path: events/{e_organizer_email}/{url_event_orig_name}/qr
   * 
   */
  checkInOrOut: async (url_event_orig_name, e_organizer_email) => {
    console.log(`GET _ah/api/connected/v1/events/${e_organizer_email}/${url_event_orig_name}/qr`)
    let token = await User.firebase.getIdToken();
    if (token) {
      let url = `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/${e_organizer_email}/${url_event_orig_name}/qr`;
      console.log(url)
      try {
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        })
        let responseJson = await response.json()
        console.log(responseJson)
        if (responseJson.error) {
          throw responseJson.error
        }
        return responseJson
      } catch (error) {
        return ({
          error: {
            message: error.message,
            errors: error.errors
          },
          code: error.code
        })
      }
    }
  },
  /**
   * description: registers user for event
   * path: events/{e_organizer_email}/{url_event_orig_name}/registration
   * param: e - event object
   * returns empty object if successful, error otherwise
   */
  register: async (e_organizer_email, url_event_orig_name, userAction, team) => {
    console.log(`PUT _ah/api/connected/v1/events/${e_organizer_email}/${url_event_orig_name}/registration`)
    let token = await User.firebase.getIdToken();
    if (token) {
      let url = `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/${e_organizer_email}/${url_event_orig_name}/registration`
      let putData
      let user_action = userAction || "both"
      if (team) {
        putData = JSON.stringify({ user_action, team })
      } else {
        putData = JSON.stringify({ user_action })
      }

      try {
        let response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: putData
        })
        let responseJson = await response.json()
        console.log(responseJson)
        if (responseJson.error) {
          throw responseJson.error
        }
        return responseJson
      } catch (error) {
        return ({
          error: {
            message: error.message,
            errors: error.errors
          },
          code: error.code
        })
      }

    }
  }
}