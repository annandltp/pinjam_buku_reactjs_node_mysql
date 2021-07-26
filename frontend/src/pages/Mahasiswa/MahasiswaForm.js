import React, { useEffect, useState, useContext } from 'react';
import cookie from 'react-cookies';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import { NotificationContext } from 'context/context.js';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export default function MahasiswaForm() {
    const api = 'http://localhost:4000/';
    const [selectOptions, setselectOptions] = useState(() => []);
    const [groupName, setGroupName] = useState('');
    const [nim, setNim] = useState('');
    const [nama, setNama] = useState('');
    const [fakultas, setFakultas] = useState('');
    const [value, handleValueChange] = useState(() => []);
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

    const createGroup = () => {
        const groupDetails = {
            nim,
            nama,
            fakultas,
            value,
        };
        console.log(groupDetails);
        axios.defaults.headers.common.authorization = localStorage.getItem('token');
        axios
          .post(`${api}mahasiswa/add`, groupDetails)
          .then((response) => {
              console.log(response);
              cookie.save('groupSelected', groupName, {
                path: '/',
                httpOnly: false,
                maxAge: 90000,
              });
              history.push('/mahasiswa');
              notify('ADD', 'Mahasiswa successfully updated!', 'Success');
              // sessionStorage.setItem('groupSelected', groupName);
          })
          .catch((err) => {
              setAlert(err.response.data.message);
        });
    };

    useEffect(() => {
        const url = `${api}mahasiswa/get`;
        axios.defaults.headers.common.authorization = localStorage.getItem('token');
        axios
            .get(url)
            .then((response) => {
                const { data } = response;
                console.log(data.users);
                const options = data.users.map((d) => ({
                  value: d.nim,
                  label: d.nama,
                }));
                setselectOptions(options);
            })
            .catch((err) => {
                console.log(err);
            });
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
                                type="text"
                                placeholder="Enter a nim..."
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
                                placeholder="Enter a nama..."
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
                                placeholder="Enter a fakultas..."
                                onChange={(e) => {
                                    setFakultas(e.target.value);
                                }}
                            />
                        </div>
                        <div className="meta-field">
                            <label htmlFor="fakultas">PILIH BUKU</label>
                            <Select style={{paddingLeft: '40000'}}
                                className="meta-form-input"
                                isMulti
                                options={selectOptions}
                                onChange={(event) => {
                                handleValueChange(event);
                                    console.log(event);
                                }}
                            />
                        </div>
                        <button className="sf-submit-button" type="button" onClick={createGroup}>
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}