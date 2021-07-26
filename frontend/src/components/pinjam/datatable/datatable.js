import { useState, useEffect, useMemo, useContext, React } from 'react';
import { useHistory } from 'react-router-dom';
import { TableHeader, Pagination, Search } from "components/DataTable";
import ConfirmModal from 'components/confirmModal/confirmModal.js';
import { v4 as uuidv4 } from 'uuid';
import { NotificationContext } from 'context/context.js';
import axios from 'axios';

export default function Datatable1(props) {
    const api = 'http://localhost:4000/';
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [nim, setNim] = useState('');
    const [nama, setNama] = useState('');
    const [fakultas, setFakultas] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });
    const [modal, setModal] = useState(false);
    const history = useHistory();
    const [confirm, setConfirm] = useState(null);
    const [pinjamId, setpinjamId] = useState(0);
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

    // ========================================================================================================
    // ==============================================FUNCTION DATATABLE========================================
    // ========================================================================================================
    const ITEMS_PER_PAGE = 50;

    const headers = [
        { name: "No#", field: "id", sortable: false },
        { name: "Nama", field: "nama", sortable: true },
        { name: "Action", field: "action", sortable: false }
    ];

    const pinjamData = useMemo(() => {
        let computedComments = comments;
        console.log(computedComments)
        if (search) {
            computedComments = computedComments.filter(
                comment =>
                    comment.nim.toLowerCase().includes(search.toLowerCase()) ||
                    comment.nama.toLowerCase().includes(search.toLowerCase())
            );
        }

        setTotalItems(computedComments.length);

        //Sorting comments
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedComments = computedComments.sort(
                (a, b) =>
                    reversed * a[sorting.field].localeCompare(b[sorting.field])
            );
        }

        //Current Page slice
        return computedComments.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [comments, currentPage, search, sorting]);
    // ========================================================================================================
    // ==============================================FUNCTION DATATABLE========================================
    // ========================================================================================================

    async function onEdit(event, set_id) {
        event.stopPropagation();
        history.push("/pinjam/edit/" + set_id + "");
    }

    useEffect(() => {
        setTimeout(() => {
            async function getData() {
                setLoading(true);
                const getURL = `${api}pinjam/get`;
        
                const response = await axios.get(getURL);
                console.log(response.status);
                if (response.status === 200) {
                    const json = await response.data;
                    console.log(json);
                    
                    setComments(json);
                    setNim(json.nim);
                    setNama(json.nama);
                    setFakultas(json.fakultas);
                }
                setLoading(false);
            }
            getData();
        },1)
    }, []);

    async function onDelete(set_id) {
        if(confirm){
            const settings = {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            }
            const getURL = `http://localhost:4000/pinjam/delete/${set_id} `;
            const response = await axios.post(getURL);
            console.log(getURL);

            if (response.status === 200) {
                notify('ADD', 'Delete successfully!', 'Success');
                window.location.reload();
            }
        }  
    }

    useEffect(() => {
        if(confirm){
            const pinjam_id = `${pinjamId}`            
            onDelete(pinjam_id);
        }
    }, [confirm]);

    //Datatable HTML
    return (
        <div className="row w-100">
            <ConfirmModal
                state={[modal, setModal]}
                setConfirm={setConfirm}
                header={"Confirm"}
                text={"Are you sure you want to delete this set? This action cannot be undone."}
            />
            <div className="col mb-3 col-12 text-center">
                <div className="row">
                    <div className="col-md-6">
                        <Pagination
                            total={totalItems}
                            itemsPerPage={ITEMS_PER_PAGE}
                            currentPage={currentPage}
                            onPageChange={page => setCurrentPage(page)}
                        />
                    </div>
                    <div className="col-md-6 d-flex flex-row-reverse">
                        <Search
                            onSearch={value => {
                                setSearch(value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                <table className="table table-striped">
                    <TableHeader
                        headers={headers}
                        onSorting={(field, order) =>
                            setSorting({ field, order })
                        }
                    />
                    <tbody>
                        {pinjamData.map(row => (
                            <tr>
                                <th scope="row" key={row.id}>
                                    {totalItems + 0}
                                </th>
                                <td>{row.nama}</td>
                                <td>
                                    <button title="search" onClick={(event) => onEdit(event, row.id)}>
                                        <span className="material-icons search">search</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
}