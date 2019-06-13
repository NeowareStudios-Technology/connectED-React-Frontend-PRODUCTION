// Contains any util/helper functions

import moment from "moment"


export default {

  isToday: (eventDate) => {
    let now = moment()
    let date = moment(eventDate, "MM/DD/YYYY")
    return date.isSame(now, 'day')
  },

  isPast: (eventDate) => {
    let now = moment()
    let date = moment(eventDate, "MM/DD/YYYY")
    return date.isBefore(now, 'day')
  },

  isFuture: (eventDate) => {
    let now = moment()
    let date = moment(eventDate, "MM/DD/YYYY")
    return date.isAfter(now, 'day')
  },
}