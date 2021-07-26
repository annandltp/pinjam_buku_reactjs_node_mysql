import React, { useEffect, useState, useContext } from 'react';
import cookie from 'react-cookies';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import { NotificationContext } from 'context/context.js';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export default function PinjamForm() {
    const [selectOptions, setselectOptions] = useState(() => []);
    const [selectOptionsBuku, setselectOptionsBuku] = useState(() => []);
    const [nim, setNim] = useState('');
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

  const createPinjam = () => {
      const dataPinjam = {
        nim,
        value,
      };
      axios
        .post(`http://localhost:4000/pinjam/add`, dataPinjam)
        .then((response) => {
          console.log(response);
          history.push('/pinjam');
          notify('ADD', 'Pinjam successfully updated!', 'Success');
        })
        .catch((err) => {
          setAlert(err.response.data.message);
        });
  };

  useEffect(() => {
      const url = `http://localhost:4000/mahasiswa/get`;
      const urlB = `http://localhost:4000/buku/get`;
      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      axios
        .get(url)
        .then((response) => {
          const { data } = response;
          console.log(data);
          const options = data.map((d) => ({
            value: d.id,
            label: d.nama,
          }));
          setselectOptions(options);
        })
      axios
        .get(urlB)
        .then((response) => {
          const { data } = response;
          console.log(data);
          const options_buku = data.map((d) => ({
            value: d.id,
            label: d.pengarang,
          }));
          console.log(options_buku);
          setselectOptionsBuku(options_buku);
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
                <div>
                  <div className="meta-field">
                    <label htmlFor="fakultas">PILIH MAHASISWA</label>
                    <Select style={{backgroundColor: 'red'}}
                        className="meta-form-input"
                        options={selectOptions}
                        onChange={(event) => {
                        setNim(event);
                            console.log(event);
                        }}
                    />
                  </div>
                  <div className="meta-field">
                    <label htmlFor="fakultas">PILIH BUKU</label>
                    <Select style={{backgroundColor: 'red'}}
                        className="meta-form-input"
                        isMulti
                        options={selectOptionsBuku}
                        onChange={(event) => {
                        handleValueChange(event);
                            console.log(event);
                        }}
                    />
                  </div>
                  <button className="sf-submit-button" type="button" onClick={createPinjam}>
                      Save
                  </button>
                </div>
              </div>
            </div>
        </section>
    )
}