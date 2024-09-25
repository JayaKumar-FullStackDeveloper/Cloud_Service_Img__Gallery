import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OtpVerification() {
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const location = useLocation(); // Get the email from location state
    const { email } = location.state || {}; // Destructure email from state


    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        let newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus the next input box automatically
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.join("").length !== 4) {
            setError("Please enter a valid 4-digit OTP.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/user/verify-otp', { otp: otp.join("") , email: email});

            if (response.data.success) {
                setSuccessMessage("OTP verified successfully. Please log in again.");
                setError(""); 
                setTimeout(() => {
                    navigate('/UserLogin');
                }, 3000); // Redirect after 3 seconds
            } else {
                setError("Invalid OTP. Please try again.");
                setSuccessMessage("");
            }
        } catch (err) {
            console.error("Error verifying OTP:", err);
            setError("An error occurred. Please try again.");
            setSuccessMessage("");
        }
    };
    const handleOnResendOtp= async()=>{
        try {
            const response = await axios.post('http://localhost:4000/user/resend-otp',email);
            console.log(response);   
            alert("Otp Was Sended Again To Your Gmail")
        } catch (error) {
            console.error("Error While Resend the Otp:", error);
        }
    }

    return (
        <div className="max-w-md mx-auto my-10 bg-pink-100 p-5">
            <h2 className="text-lg font-semibold text-pink-600 mb-5">OTP Verification</h2>
            {email && <p className="text-sm mb-4 text-pink-600">Check your email ({email}) for the OTP.</p>}
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className="flex space-x-3 mb-4">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            className="shadow appearance-none border rounded w-12 h-12 text-center text-pink-600 text-xl leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e.target, index)}
                            onFocus={(e) => e.target.select()}
                        />
                    ))}
                </div>
                <span className='block text-pink-600 text-sm text-right font-bold mb-3 hover:text-pink-800' onClick={handleOnResendOtp()}>Resend OTP</span>


                <button
                    className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Verify OTP
                </button>
            </form>
        </div>
    );
}

export default OtpVerification;
