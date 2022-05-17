import { useOutletContext, useParams } from 'react-router-dom';

import MemberProfile from './MemberProfile';
import MyProfile from './MyProfile';

const Profile = () => {
  const { currentUserId } = useOutletContext();
  let params = useParams();
  const uid = params.uid;
  const tab = params.tab;

  if (!currentUserId) {
    return <MemberProfile uid={uid} />;
  }

  return (
    <>{uid === currentUserId ? <MyProfile tab={tab} /> : <MemberProfile uid={uid} />}</>
  );
};

export default Profile;
