// Contains any util/helper functions
import moment from "moment"

/**
 * Checks if the date passed in occurs today
 * @param {string} eventDate - date from event
 * @returns {boolean} true if event occurs today, false otherwise
 */
export const isToday = (eventDate) => {
  let now = moment()
  let date = moment(eventDate, "MM/DD/YYYY")
  return date.isSame(now, 'day')
}

/**
 * Checks if the date passed in occurs before today
 * @param {string} eventDate - date from event
 * @returns {boolean} true if event occurs today, false otherwise
 */
export const isPast = (eventDate) => {
  let now = moment()
  let date = moment(eventDate, "MM/DD/YYYY")
  return date.isBefore(now, 'day')
}

/**
 * Checks if the date passed in occurs after today
 * @param {string} eventDate - date from event
 * @returns {boolean} true if event occurs today, false otherwise
 */
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
