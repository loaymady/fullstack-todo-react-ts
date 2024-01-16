interface IProps {
  data?: unknown;
}
const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;
const ProfilePage = ({ data }: IProps) => {
  return (
    <div>
      <h1>Profile</h1>
      <h2>Email: {userData.user.email}</h2>
    </div>
  );
};

export default ProfilePage;
