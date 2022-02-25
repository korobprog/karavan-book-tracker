import React from "React"
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

export default function Home() {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  console.log("Loading:", loading, "|", "Current user:", user);

  return <div>Hello!</div>;
}
