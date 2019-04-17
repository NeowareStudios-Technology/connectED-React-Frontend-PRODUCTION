import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  contentContainer: {
    paddingTop: 30
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
  }
});

export default styles;
