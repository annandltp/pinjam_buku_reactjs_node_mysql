import React, { useEffect, useState, useContext, useMemo } from 'react';
import cookie from 'react-cookies';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import { NotificationContext } from 'context/context.js';
import { Redirect } from 'react-router';
import { Col, Row, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function PinjamEdit(props) {
    const pinjam_id = props.match.params.set_id;
    const [selectOptions, setselectOptions] = useState(() => []);
    const [groupName, setGroupName] = useState('');
    const [id, setId] = useState('');
    const [nim, setNim] = useState([]);
    const [nama, setNama] = useState('');
    const [fakultas, setFakultas] = useState('');
    const [value, handleValueChange] = useState(() => []);
    const [alert, setAlert] = useState('');
    const [idUpdate, setIdUpdate] = useState('');
    const [nimUpdate, setNimUpdate] = useState('');
    const [namaUpdate, setNamaUpdate] = useState('');
    const [fakultasUpdate, setFakultasUpdate] = useState('');
    
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
  // let redirectVar = null;
  if (!localStorage.getItem('token')) {
    redirectVar = <Redirect to="/login" />;
  }
  // const email = cookie.load('email');
  const createGroup = () => {
    // const formDetails = [sessionStorage.getItem('email'), form];
    const groupDetails = {
      nim,
      nama,
      fakultas,
      value,
    };
    console.log(groupDetails);
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .post(`http://localhost:4000/mahasiswa/add`, groupDetails)
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

  

  const updateProfile = () => {
    // send();

    axios
      .post(`http://localhost:4000/mahasiswa/edit`, {
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
        const getURL = `http://localhost:4000/pinjam/get/${pinjam_id} `;
        
        const response = await axios.get(getURL);
        console.log(response.data.detail);
        setId(response.data.detail[0]);
        setNama(response.data.users[0][0].nama);
        setNim(response.data.detail[0]);
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
                        <label htmlFor="nama">Buku yang dipinjam</label>
                    </div>
                    <table className="tabel1">
                        <thead className="tabel1">
                            <tr className="tabel1">
                                <td>No</td>
                                <td>Judul</td>
                            </tr>
                        </thead>
                        <tbody className="tabel1">
                            {nim.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.judul}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button className="sf-submit-button" type="button" onClick={updateProfile}>
                        Save
                    </button>
                </form>
            </div>
            
        </div>
        
            
        </section>
        
    )
}