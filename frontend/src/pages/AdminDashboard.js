import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AuthContext } from '../auth/AuthContext';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingItem, setEditingItem] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  const addUserSchema = yup.object().shape({
    name: yup.string().required('Enter Name'),
    email: yup.string().email("Enter a valid Email Address").required("MUST enter your Email."),
    phone: yup
      .string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Enter Phone Number"),
    location: yup.string().required("Enter Location"),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(addUserSchema) });

  const usersList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASEURL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      setUsers(response.data.users);

    } catch (error) {
      console.log(error);

      if (error.response && error.response.status === 401) {
        // Allow time for the user to see the error message before navigating
        
        setTimeout(() => {
          logout();
        }, 2000); // Adjusted to 5 seconds (5000 ms) for better visibility
      }
    }
  };

  useEffect(() => {
    usersList();
  }, [token]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEditItem = (user) => {
    setEditingItem(user);
  };

  const handleSaveItem = async () => {
    console.log('handleSaveItem');
    //save to db via patch
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASEURL}/user/edit`, {
        ...editingItem
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editingItem._id ? { ...user, ...editingItem } : user
        )
      );
      setEditingItem({});
    }
    catch (error) {
      console.log(error);
      if (error.response)
        setErrorMessage(error.response.data.message)

      if (error.response && error.response.status === 401) {
        // Allow time for the user to see the error message before navigating
        
        setTimeout(() => {
          logout();
        }, 2000); // Adjusted to 5 seconds (5000 ms) for better visibility
      }
    }

  };


  const handleCancelEdit = () => {
    setEditingItem({});
  };

  const handleShowDeleteModal = (user) => {
    setSelectedUser(user);
    handleShow();
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_BASEURL}/user/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      // Update user after deletion
      setUsers((prevUsers) => prevUsers.filter(user => user._id !== id));
      handleClose(); // Close the modal after deletion
      console.log(response.data.message); // Optional: log success message
    } catch (error) {
      console.log(error);
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred while deleting the user.");
      }
      if (error.response && error.response.status === 401) {
        // Allow time for the user to see the error message before navigating
        handleClose();
        setTimeout(() => {
          logout();
        }, 2000); // Adjusted to 5 seconds (5000 ms) for better visibility
      }
    }
  };

  const addUser = async (data) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASEURL}/user/add`,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          location: data.location,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      reset();
      usersList();

    }
    catch (error) {
      console.log(error);

      if (error.response) {
        setErrorMessage(error.response.data.message);
      }

      if (error.response && error.response.status === 401) {
        // Allow time for the user to see the error message before navigating
        
        setTimeout(() => {
          logout();
        }, 2000); // Adjusted to 5 seconds (5000 ms) for better visibility
      }
    }
  }

  return (
    <div className="container mt-3">
      <div className="row mt-4 d-flex justify-content-center">
        <div className="col-lg-9 text-center my-4 ">
          <h3>List of Users</h3>
          {errorMessage && <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>}
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr key="addUser">
                <td colSpan="6">
                  <form className="d-flex mt-4 justify-content-center gap-3" onSubmit={handleSubmit(addUser)}>
                    <div>
                      <input type="text" className="form-control" placeholder="Name" {...register("name")} />
                      <p className="text-danger">{errors.name?.message}</p>
                    </div>
                    <div>
                      <input type="text" className="form-control" placeholder="Email" {...register("email")} />
                      <p className="text-danger">{errors.email?.message}</p>
                    </div>
                    <div>
                      <input type="text" className="form-control" placeholder="Phone" {...register("phone")} />
                      <p className="text-danger">{errors.phone?.message}</p>
                    </div>
                    <div>
                      <input type="text" className="form-control" placeholder="Location" {...register("location")} />
                      <p className="text-danger">{errors.location?.message}</p>
                    </div>
                    <div>
                      <button type="submit" className="btn btn-success">Add New User</button>
                    </div>
                  </form>
                </td>
              </tr>
              {users.map((user, index) =>
              (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>
                    {editingItem._id === user._id ? (
                      <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td>
                    {editingItem._id === user._id ? (
                      <input type="text" value={editingItem.email} onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })} />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {editingItem._id === user._id ? (
                      <input type="text" value={editingItem.phone} onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })} />
                    ) : (
                      user.phone
                    )}
                  </td>
                  <td>
                    {editingItem._id === user._id ? (
                      <input type="text" value={editingItem.location} onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })} />
                    ) : (
                      user.location
                    )}
                  </td>
                  <td>
                    {editingItem._id === user._id ? (
                      <>
                        <button className="btn btn-outline-success me-3" onClick={handleSaveItem}> Save </button>
                        <button className="btn btn-outline-secondary me-3" onClick={handleCancelEdit}> Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className='btn btn-outline-warning me-3' onClick={() => handleEditItem(user)}>Edit</button>
                        <button className='btn btn-outline-danger me-3' onClick={() => handleShowDeleteModal(user)}> Delete</button>

                        <Modal show={show} onHide={handleClose}>
                          <Modal.Header closeButton>
                            <Modal.Title>Delete Confirmation</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>Are you sure you want to delete the user {selectedUser?.name}? </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>Cancel Delete</Button>
                            <Button variant="danger" onClick={() => handleDelete(selectedUser?._id)}>Delete</Button>
                          </Modal.Footer>
                        </Modal>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  )
}

export default AdminDashboard