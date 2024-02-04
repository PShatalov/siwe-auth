import React, { useState, useEffect } from "react";
import { BACKEND_ADDR } from "./EthereumAuth";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<{
    username: string;
    createdAt: string;
  }>();

  const fetchProfile = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const res = await fetch(`${BACKEND_ADDR}/user/profile`, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!res.ok && res.status === 401) {
      localStorage.removeItem("user");

      window.location.href = "/";
    } else {
      const data = await res.json();
      setUserData(data);
    }
  };
  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  console.log(userData);
  return (
    <>
      {userData && (
        <div>
          <div className="profile-container">
            <p>user name: {userData.username}</p>
            <p>created date: {userData.createdAt}</p>
          </div>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </>
  );
};

export default Profile;
