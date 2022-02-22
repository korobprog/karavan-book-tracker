import firebase from "../firebase/clientApp";
import {useAuthState} from "react-firebase-hooks/auth"
import firebaseConfig from "../firebase/clientApp"
import React from "React"


export default function Home() {
const [user, loading, error] = useAuthState(firebase.auth());
console.log("Loading:", loading, "|" , "Current user:", user);

return <div>Hello!</div>;

}