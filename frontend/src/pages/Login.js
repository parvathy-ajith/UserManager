import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
//import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

function Login() {
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { login, role } = useContext(AuthContext);

    const loginSchema = yup.object().shape({
        email: yup.string().email("Enter valid Email Address").required("MUST enter your Email."),
        password: yup.string()
          .matches(/^[a-zA-Z0-9!@#$%&*]{5}$/, "Password should have 5 characters !! ")
          .required("MUST enter your Password.")
      });

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) });

    const loginUser = async (data) => {
        try {
            // const response = await axios.post(`${process.env.REACT_APP_API_BASEURL}/login`, {
            //     email: data.email,
            //     password: data.password
            // });
            //token, username, role set in AuthContext  
            //login(response.data.token, response.data.username)
            login('token','username','user');
            if(role==='admin'){
                navigate('/admin/dashboard');
            }
            else if(role==='user'){
                navigate('/user/profile');
            }
            
        }
        catch (error) {
            console.log(error);
            if (error.response)
                setErrorMessage(error.response.data.message)
        }

    }

    const content = (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card w-50 p-5">
                <form className="card-body" onSubmit={handleSubmit(loginUser)}>
                    <h1 className="text-center mb-5">Login</h1>
                    {errorMessage && <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>}
                    <div className="userInput mb-3">
                        <input type="text" className="form-control" placeholder="Email" {...register("email")} />
                        <p className='text-danger'>{errors.email?.message}</p>
                    </div>
                    <div className="userInput mb-3">
                        <input type="password" className="form-control" placeholder="Password" {...register("password")} />
                        <p className='text-danger'>{errors.password?.message}</p>
                    </div>
                    <div>
                        <button className="btn btn-dark w-100">LOGIN</button>
                    </div>
                </form>
            </div>
        </div>
    )

    return content
}

export default Login