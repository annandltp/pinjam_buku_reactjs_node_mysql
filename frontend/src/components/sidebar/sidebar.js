import { useCallback, useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from 'context/context.js';
import ProfilePic from 'components/profilePic/profilePic.js';

import './sidebar.css';

export default function Sidebar(props) {
    const [awaitResp, setAwaitResp] = useState(false);
    const currentPage = useLocation();
    const user = useContext(UserContext);

    useEffect(() => {
        if(props.width < 1026)
            props.setShowDropdown(false);
        
    }, [currentPage]);

    const sendRequest = useCallback(async () => {
        if (awaitResp)
            return;
        else {
            // Set to true to disable logout button (prevent spam clicking)
            setAwaitResp(true);

            // If a user is even logged in...
            if (user !== null) {

                // Send logout request...
                const body = JSON.stringify({
                });
                const settings = {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: body,
                };
                const response = await fetch('/api/logout', settings);
                if (response.status === 201) {
                    //const json = await response.json();
                    localStorage.setItem('user', null);
                    window.location.href = "/browse";
                }

                setAwaitResp(false);
            }
        }
    }, [awaitResp, user]);

    const isCurrentPage = (path) => {
        return currentPage.pathname.includes(path);
    }

    const setProfile = () => {
        if (user) {
            return (
                <div className="sidebar-profile-item">
                    <div className="profile-pic-border">
                        <ProfilePic
                            username={user.username}
                            dimensions={"60px"}
                            border={true}
                        />
                    </div>

                    <span className="sidebar-profile-username">Hello, {user.username}</span>
                    <button onClick={() => sendRequest()}>Logout</button>
                </div>
            )
        }
        else {
            return (
                <div className="sidebar-profile-item">
                    <div className="profile-pic-border">
                        <ProfilePic
                            username={"?guest"}
                            dimensions={"60px"}
                            border={true}
                        />
                    </div>
                    <span className="sidebar-profile-username">Hello, Guest</span>
                    <button onClick={() => props.setShowLoginModal(true)}>Login/Register</button>
                </div>
            )
        }
    }

    return (
        <div className="sidebar-container no-select">
            <div className="sidebar-header">
                <Link
                    to="/"
                >Hippo.</Link>
            </div>

            <ul className="sidebar-items-container">
                {
                    setProfile()
                }
                <li className={`sidebar-item ? ${isCurrentPage("/mahasiswa") ? "current-page" : ""}`}>
                    <Link
                        className="sidebar-link-wrapper"
                        to="/mahasiswa"
                    >
                        <span className="material-icons">group_add</span>
                        <span htmlFor="sets">Mahasiswa</span>
                    </Link>
                </li>
                <li className={`sidebar-item ? ${isCurrentPage("/buku") ? "current-page" : ""}`}>
                    <Link
                        className="sidebar-link-wrapper"
                        to="/buku"
                    >
                        <span className="material-icons">book</span>
                        <span htmlFor="sets">Buku</span>
                    </Link>
                </li>
                <li className={`sidebar-item ? ${isCurrentPage("/pinjam") ? "current-page" : ""}`}>
                    <Link
                        className="sidebar-link-wrapper"
                        to="/pinjam"
                    >
                        <span className="material-icons">import_contacts</span>
                        <span htmlFor="sets">Pinjam</span>
                    </Link>
                </li>

            </ul>
        </div>
    );
}