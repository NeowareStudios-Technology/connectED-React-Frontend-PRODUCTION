import * as firebase from "firebase";
import "firebase/auth";
import appConfig from "../constants/appConfig";

firebase.initializeApp(appConfig.firebase);

export default firebase;
