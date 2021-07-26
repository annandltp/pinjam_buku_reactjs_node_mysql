import React, { useEffect, useState, useContext } from 'react';
import cookie from 'react-cookies';
import { v4 as uuidv4 } from 'uuid';
import { NotificationContext } from 'context/context.js';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export default function BukuEdit(props) {
    const api = 'http://localhost:4000/';
    const buku_id = props.match.params.set_id;
    const [id, setId] = useState('');
    const [judul, setJudul] = useState('');
    const [pengarang, setPengarang] = useState('');
    const [alert, setAlert] = useState('');
    
    const { email } = '';
    const name = cookie.load('name'); // sessionStorage.getItem('fullname');
    const history = useHistory();
    const userEmail = localStorage.getItem('email');
    const notifications = useContext(NotificationContext);

    function notify(type, text, status) {
        notifications({
            type: type,
            value: {
                id: uuidv4(),
                text: text,
                status: status,
            }
        });
    }

    let redirectVar = null;
    if (!localStorage.getItem('token')) {
        redirectVar = <Redirect to="/login" />;
    }

    const updateProfile = () => {
        axios
        .post(`${api}buku/edit`, {
            id,
            judul,
            pengarang,
        })
        .then((response) => {
            console.log(response);
            history.push('/buku');
            notify('ADD', 'Buku successfully updated!', 'Success');
        });
    };

    useEffect(async () => {
        const getURL = `${api}buku/get/${buku_id} `;
        const response = await axios.get(getURL);
        console.log(response.data.pengarang);
        setId(response.data.id);
        setPengarang(response.data.pengarang);
        setJudul(response.data.judul);
    }, []);

    return (
        <section className="create-set-page-wrapper">
            <div className="set-form-container">
                <div className="sf-header-container">
                    <span></span>
                </div>
                <div className="sf-meta-container">
                    <form className="meta-container">
                        <div>
                            <label htmlFor="judul">Judul</label>
                            <input
                                className="meta-form-input"
                                id="judul"
                                type="hidden"
                                value={id}
                                onChange={(e) => {
                                    setJudul(e.target.value);
                                }}
                            />
                            <input
                                className="meta-form-input"
                                id="judul"
                                type="text"
                                value={judul}
                                onChange={(e) => {
                                    setJudul(e.target.value);
                                }}
                            />
                        </div>
                        <div className="meta-field">
                            <label htmlFor="pengarang">Pengarang</label>
                            <input
                                className="meta-form-input"
                                id="pengarang"
                                type="text"
                                value={pengarang}
                                onChange={(e) => {
                                    setPengarang(e.target.value);
                                }}
                            />
                        </div>
                        <button className="sf-submit-button" type="button" onClick={updateProfile}>
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}