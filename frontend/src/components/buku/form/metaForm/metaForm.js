// import './metaForm.css';

export default function MetaForm(props) {
    return (
        <form className="meta-container">
            <div>
                <label htmlFor="nim">NIM</label>
                <input
                    className="meta-form-input"
                    id="nim"
                    type="text"
                    placeholder="Enter a nim..."
                    value={props.nim}
                    onChange={(event) => props.setNim(event.target.value)}
                />
            </div>
            <div className="meta-field">
                <label htmlFor="nama">NAMA</label>
                <input
                    className="meta-form-input"
                    id="nama"
                    type="text"
                    placeholder="Enter a nama..."
                    value={props.nama}
                    onChange={(event) => { props.setNama(event.target.value) }}
                />
            </div>
            <div className="meta-field">
                <label htmlFor="fakultas">FAKULTAS</label>
                <input
                    className="meta-form-input"
                    id="fakultas"
                    type="text"
                    placeholder="Enter a fakultas..."
                    value={props.fakultas}
                    onChange={(event) => { props.setFakultas(event.target.value) }}
                />
            </div>

        </form>
    )
}