import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useAuth } from '../Components/AuthProvider';

const UserHeader=()=>{
    const { user, logout } = useAuth();
   
    return (
        <>
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between h-14 items-center px-4 sm:px-6 lg:px-8">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link to="/" className="text-xl font-bold text-pink-400">JK Img Cloud Service</Link>
                            </div>
                        </div>
                        <div className='flex items-center w-3/5 space-x-4'>
                            <div className='h-auto items-center w-full lg:flex hidden'>
                                <input type="text" className="px-4 h-10 py-2 pr-10 w-full text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search..." />
                            </div>
                            <div className="flex-1 flex items-center justify-end sm:items-stretch sm:justify-center w-full">
                                <div className="lg:flex justify-end sm:block hidden w-full">
                                    <div className="flex space-x-4">
                                        <Link to="/" className="text-gray-700 hover:text-blue-900 px-3 py-2 rounded-md text-lg font-medium">Home</Link>
                                        <Link to="/about" className="text-gray-700 hover:text-blue-900 px-3 py-2 rounded-md text-lg font-medium">About</Link>
                                        <Link to="/user/gallary" className="text-gray-700 hover:text-blue-900 px-3 py-2 rounded-md text-lg font-medium">Gallary</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-8">
                            <div>
                                {user ? (
                                    <>
                                        <span className="text-gray-700 font-bold mr-4">Welcome!</span>
                                        {/* <span className="text-gray-700 font-bold mr-4">{user.email}</span>         */}
                                        <button className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-2 rounded"
                                         onClick={logout}
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/userLogin" className="ml-4 text-gray-700 hover:text-blue-900">
                                        <FontAwesomeIcon icon={faUser} className="text-lg" />
                                        <span className="text-gray-700 pl-3 py-2 hover:text-blue-900 rounded-md text-l font-semibold">Login</span>
                                    </Link>
                                )}
                            </div>
                            <Link to="#" className="ml-4 text-gray-700 hover:text-gray-900 sm:block hidden">
                                <FontAwesomeIcon icon={faHeart} className="text-lg" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default UserHeader;