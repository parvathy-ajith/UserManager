import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
//import axios from 'axios';


function UserProfile() {
  const [user, setUser] = useState({});
  const { token } = useContext(AuthContext);

  const userDetails = async () => {
    try {
      // const response = await axios.get(`${process.env.REACT_APP_API_BASEURL}/users`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   }
      // });
      // console.log(response.data);
      // setUsers(response.data.users);

      setUser(
        { id: 1, name: "Rahul", email: "rahul@gmail.com", phone: "9495949422", location: "Trivandrum" }
      );
      console.log(user);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    userDetails();
  }, [token]);

  return (
    <div className="container mt-3">
      <div className="row mt-4 d-flex justify-content-center">
        <div className="col-lg-9 text-center my-4">
          <h3>User Profile</h3>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-6">
          {user ? (
            <div className="card p-4 text-center"> {/* Added 'text-center' class */}
              <h5 className="mb-3">Name: {user.name}</h5>
              <h5 className="mb-3">Email: {user.email}</h5>
              <h5 className="mb-3">Phone: {user.phone}</h5>
              <h5 className="mb-3">Location: {user.location}</h5>
            </div>
          ) : (
            <p>Loading user profile...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile