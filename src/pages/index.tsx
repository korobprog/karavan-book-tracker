import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

export default function Home() {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  console.log("Loading:", loading, "|", "Current user:", user);

  return <div>Hello!</div>;
}
