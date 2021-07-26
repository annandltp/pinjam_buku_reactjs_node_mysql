import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MetaForm from './metaForm/metaForm.js';
import CardForm from './cardForm/cardForm.js';

// import './setForm.css';

export default function SetForm(props) {
    const bottom = useRef(null);

    return (
        <div className="set-form-container">
            <div className="sf-header-container">
                <span>{props.header}</span>
            </div>
            <div className="sf-meta-container">
                <MetaForm
                    nim={props.nim}
                    setNim={props.setNim}
                    nama={props.nama}
                    setNama={props.setNama}
                    fakultas={props.fakultas}
                    setFakultas={props.setFakultas}
                    selectedTags={props.selectedTags ? props.selectedTags : []}
                />
            </div>
            <button
                ref={bottom}
                className="sf-submit-button"
                onClick={() => props.submit()}
            >Save</button>
        </div>
    )
}