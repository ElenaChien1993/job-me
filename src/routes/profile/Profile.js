import { useParams } from "react-router-dom";

import firebase from "../../utils/firebase";
import MemberProfile from "./MemberProfile";
import MyProfile from "./MyProfile";

const Profile = () => {
  const currentUserId = firebase.auth.currentUser.uid;
  let params = useParams();
  const uid = params.uid;

  return (
    <>
      {uid === currentUserId ? <MyProfile uid={currentUserId}/> : <MemberProfile uid={uid}/>}
    </>
  )
}

export default Profile;