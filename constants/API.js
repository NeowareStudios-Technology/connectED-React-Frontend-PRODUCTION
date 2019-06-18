//  Helper file for all API calls to the connectED database
import User from "../components/User"

/**
 * Checks user in/out of an event by adding/removing user from signed in/out attendees
 * path: events/{e_organizer_email}/{url_event_orig_name}/qr
 * @async
 * @function checkUserInOrOut
 */
export const checkUserInOrOut = async (url_event_orig_name, e_organizer_email) => {
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
      console.log("API RESPONSE:", responseJson)
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

/**
 * Registers user for event by adding user to event attendees
 * path: events/{e_organizer_email}/{url_event_orig_name}/registration
 * @async
 * @function registerUser
 * @param {string} e_organizer_email - event organizer email
 * @param {string} url_event_orig_name - event url original name
 * @returns {object} empty object if successful, error otherwise
 */
export const registerUser = async (e_organizer_email, url_event_orig_name) => {
  console.log(`PUT _ah/api/connected/v1/events/${e_organizer_email}/${url_event_orig_name}/registration`)
  let token = await User.firebase.getIdToken();
  if (token) {
    let url = `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/${e_organizer_email}/${url_event_orig_name}/registration`
    let putData = JSON.stringify({ user_action: "both" })

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
      console.log("API RESPONSE:", responseJson)
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

/**
 * De-registers user from event by removing user from event attendees
 * path: events/{e_organizer_email}/{url_event_orig_name}/registration
 * @async
 * @function deregisterUser
 * @param {object} e - event object
 * @returns {object} empty object if successful, error otherwise
 */
export const deregisterUser = async (e_organizer_email, url_event_orig_name) => {
  console.log(`DELETE _ah/api/connected/v1/events/${e_organizer_email}/${url_event_orig_name}/registration`)
  let token = await User.firebase.getIdToken();
  if (token) {
    let url = `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/${e_organizer_email}/${url_event_orig_name}/registration`

    try {
      let response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
      let responseJson = await response.json()
      console.log("API RESPONSE:", responseJson)
      // error returned from server/database
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
