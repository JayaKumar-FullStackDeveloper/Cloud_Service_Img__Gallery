import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PasswordReset() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        setEmail(e.target.value);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/user/forgot-password", { email });
            console.log(response, "res");
            console.log('OTP sent');
            navigate("/verify-otp" , { state: { email: email } });
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 bg-pink-100 p-5 rounded shadow-md">
            <h2 className="text-2xl font-bold text-pink-600 mb-5">Password Reset</h2>
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <form onSubmit={handleOnSubmit}>
                <div className="mb-4">
                    <label className="block text-pink-600 text-sm text-left font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleOnChange}
                    />
                </div>
                <button
                    className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default PasswordReset;
