'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserAuth } from '../context/AuthContext';

const NavBar = () => {
    const { user, GoogleSignIn, logOut } = UserAuth();
    const [loading, setLoading] = useState(true);

    const handleSignIn = async () => {
        try {
            await GoogleSignIn();
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 20));
            setLoading(false);
        };
        checkAuthentication();
    }, [user]);

    return (
        <section>
            <div className="fixed top-0 right-0 flex items-center p-3 h-14 bg-transparent">
                {!loading && (
                    <ul className="flex space-x-2">
                        {!user ? (
                            <>
                                <li>
                                    <button
                                        className="px-4 py-2 rounded-md"
                                        style={{ backgroundColor: 'black', color: 'white' }}
                                        onClick={handleSignIn}
                                    >
                                        <Link href="/">Login</Link>
                                    </button>
                                </li>
                                <li>
                                    <div
                                        className="px-4 py-2 rounded-md"
                                        style={{ backgroundColor: 'black', color: 'white' }}
                                        onClick={handleSignIn}
                                    >
                                        <Link href="/">Signup</Link>
                                    </div>
                                </li>
                            </>
                        ) : (
                            <li>
                                <button
                                    className="px-4 py-2 rounded-md"
                                    style={{ backgroundColor: 'black', color: 'white' }}
                                    onClick={handleSignOut}
                                >
                                    <Link href="/">Logout</Link>
                                </button>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </section>
    );
};

export default NavBar;