import {Link} from "react-router-dom";

import React, { Component } from 'react'
import Datatable from 'components/mahasiswa/datatable/datatable.js'

export default function Mahasiswa() {
    return (
        <div classname="content-wrapper" style={{paddingLeft: 50, paddingRight: 500}}>
            <div>
                <br /><br /><br /><br />
            </div>
            {/* Main content */}
            <div className="content">
                <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header border-0">
                            <div className="d-flex justify-content-between">
                                <h3 className="card-title">Data Mahasiswa</h3>
                                <Link to="/mahasiswa/add">
                                    <button type="button" className="btn btn-primary float-right"><i className="fas fa-plus" /> Tambah Mahasiswa</button>
                                </Link>
                            </div>
                            </div>
                            <div className="card-body">
                                <Datatable/>
                            </div>
                        </div>
                    </div>
                    {/* /.col-md-6 */}
                </div>
                {/* /.row */}
                </div>
                {/* /.container-fluid */}
            </div>
            {/* /.content */}
        </div>
    );
}
