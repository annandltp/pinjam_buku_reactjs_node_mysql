import React, { useEffect, useState, useContext } from 'react';
import cookie from 'react-cookies';
import { v4 as uuidv4 } from 'uuid';
import { NotificationContext } from 'context/context.js';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export default function MahasiswaForm(props) {
    const api = 'http://localhost:4000/';
    const mahasiswa_id = props.match.params.set_id;
    const [id, setId] = useState('');
    const [nim, setNim] = useState('');
    const [nama, setNama] = useState('');
    const [fakultas, setFakultas] = useState('');
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
        .post(`${api}mahasiswa/edit`, {
            id,
            nim,
            nama,
            fakultas,
        })
        .then((response) => {
            console.log(response);
            history.push('/mahasiswa');
            notify('ADD', 'Mahasiswa successfully updated!', 'Success');
        });
    };

    useEffect(async () => {
        const getURL = `${api}mahasiswa/get/${mahasiswa_id} `;
        const response = await axios.get(getURL);
        console.log(response.data.nama);
        setId(response.data.id);
        setNama(response.data.nama);
        setNim(response.data.nim);
        setFakultas(response.data.fakultas);
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
                            <label htmlFor="nim">NIM</label>
                            <input
                                className="meta-form-input"
                                id="nim"
                                type="hidden"
                                value={id}
                                onChange={(e) => {
                                    setNim(e.target.value);
                                }}
                            />
                            <input
                                className="meta-form-input"
                                id="nim"
                                type="text"
                                value={nim}
                                onChange={(e) => {
                                    setNim(e.target.value);
                                }}
                            />
                        </div>
                        <div className="meta-field">
                            <label htmlFor="nama">NAMA</label>
                            <input
                                className="meta-form-input"
                                id="nama"
                                type="text"
                                value={nama}
                                onChange={(e) => {
                                    setNama(e.target.value);
                                }}
                            />
                        </div>
                        <div className="meta-field">
                            <label htmlFor="fakultas">FAKULTAS</label>
                            <input
                                className="meta-form-input"
                                id="fakultas"
                                type="text"
                                value={fakultas}
                                onChange={(e) => {
                                    setFakultas(e.target.value);
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