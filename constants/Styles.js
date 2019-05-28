import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    paddingTop: 30,
    flex:1
  },
  displayH4: {
    fontSize: 16,
    color: "#adadad",
    paddingHorizontal: 12,
    marginBottom: 12
  },
  displayH1: {
    fontSize: 30,
    color: "#000",
    fontWeight: "bold",
    paddingHorizontal: 12
  },
  btnSm: {
    padding: 6
  },
  errorMessage: {
    fontSize: 12,
    color: "red",
    marginTop: 6,
    paddingHorizontal:6
  },
  teamListing: {
    backgroundColor: '#fafafa',
    flex: 1, 
    flexDirection: 'row',
    color: 'black',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
},
eventsContainer: {
  paddingLeft: 30,
  paddingRight: 30,
  paddingTop: 15,
},
});

export default styles;
