import firebase from "../firebase/clientApp";
import {useAuthState} from "react-firebase-hooks/auth"
import firebaseConfig from "../firebase/clientApp"

export default function Home() {
const [user, loading, error] = useAuthState(firebase.auth());
console.log("Loading:", loading, "|" , "Current user:", user);

return <div>Hello!</div>;

}