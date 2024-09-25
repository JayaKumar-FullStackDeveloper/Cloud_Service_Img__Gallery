import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Registration() {
    const initialState = {
        name: "",
        email: "",
        phoneNumber: "",
        password: ""
    };

    const [formData, setFormData] = useState(initialState);
    const [editMode, setEditMode] = useState(false);
    const { id } = useParams();

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, [name]: value
        }));
    };

    const navigate = useNavigate();
    useEffect(() => {
        const getById = async () => {
            try {
                const result = await axios.get(`http://localhost:4000/user/getuserbyId/${id}`);
                setFormData(result.data.data);
            } catch (err) {
                console.log("Error While Getting Data From this Id", id, " ", err);
            }
        };

        if (id) {
            getById();
            setEditMode(true);
        } else {
            setEditMode(false);
        }
    }, [id]);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.put(`http://localhost:4000/user/update/${id}`, formData);
                alert("Data Was Updated");
                navigate("/")
            } else {
                await axios.post('http://localhost:4000/user/usercreate', formData);
                alert("Data Was Posted");
            }
            setFormData(initialState);
            navigate("/verify-otp" , { state: { email: formData.email } });
        } catch (err) {
            console.log(`Data didn't ${editMode ? 'update' : 'post'}`, err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 bg-pink-100 p-5">
            <h2 className="text-lg font-semibold  text-pink-600 mb-5">{editMode ? "Update Account" : "Create New Account"}</h2>
            <form onSubmit={handleOnSubmit}>
                {Object.keys(initialState).map((key) => (
                    <div className="mb-4" key={key}>
                        <label className="block text-pink-600 text-sm font-bold mb-2" htmlFor={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3  text-pink-600 leading-tight focus:outline-none focus:shadow-outline"
                            id={key}
                            type={key === 'password' ? 'password' : 'text'}
                            placeholder={`Enter your ${key}`}
                            name={key}
                            value={formData[key]}
                            onChange={handleOnChange}
                        />
                    </div>
                ))}
                <button
                    className="bg-pink-500 hover:bg-pink-700 text-white ml-40 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    {editMode ? "Update" : "Register"}
                </button>
            </form>
        </div>
    );
}

export default Registration;
