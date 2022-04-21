import { useOutletContext, useParams } from "react-router-dom";

import MemberProfile from "./MemberProfile";
import MyProfile from "./MyProfile";

const Profile = () => {
  const { currentUserId } = useOutletContext();
  let params = useParams();
  const uid = params.uid;

  return (
    <>
      {uid === currentUserId ? <MyProfile /> : <MemberProfile uid={uid}/>}
    </>
  )
}

export default Profile;