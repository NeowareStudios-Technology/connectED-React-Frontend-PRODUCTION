// Contains any util/helper functions

import moment from "moment"


export const isToday = (eventDate) => {
  let now = moment()
  let date = moment(eventDate, "MM/DD/YYYY")
  return date.isSame(now, 'day')
}

export const isPast = (eventDate) => {
  let now = moment()
  let date = moment(eventDate, "MM/DD/YYYY")
  return date.isBefore(now, 'day')
}

export const isFuture = (eventDate) => {
  let now = moment()
  let date = moment(eventDate, "MM/DD/YYYY")
  return date.isAfter(now, 'day')
}

/**
 * @param {array} events - An array of events
 * @returns {array} events sorted in descending order
 */
export const sortEventsDesc = (events) => {
  return events.slice().sort((a, b) => new Date(b.date[0]) - new Date(a.date[0]))
}

/**
 * @param {array} events - An array of events
 * @returns {array} events sorted in ascending order
 */
export const sortEventsAsc = (events) => {
  return events.slice().sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]))
}
