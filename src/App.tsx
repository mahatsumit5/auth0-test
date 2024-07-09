import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import axios from "axios";

function App() {
  const { loginWithRedirect, logout, getAccessTokenWithPopup } = useAuth0();
  return (
    <>
      <button
        onClick={async () => {
          const data = await getAccessTokenWithPopup();
          sessionStorage.setItem("token", data!);
        }}
      >
        login
      </button>

      <button
        onClick={() => {
          logout();
        }}
      >
        logout
      </button>
      <Profile />
      <button
        onClick={async () => {
          const { data } = await axios.get("http://localhost:8080/authorized", {
            headers: {
              authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          });
          console.log(data);
        }}
      >
        make api call
      </button>
    </>
  );
}

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated &&
    user && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <button
          onClick={async () => {
            const { data } = await axios.request({
              method: "GET",
              url: "http://localhost:8080",
              withCredentials: true,
            });
            sessionStorage.setItem("token", data.access_token);
          }}
        >
          get your token
        </button>
      </div>
    )
  );
};
export default App;
