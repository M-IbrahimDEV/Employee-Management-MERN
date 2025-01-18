import ModalPopUp from '../ModalPopUp/ModalDetails'
import Card from './component/Card'
import { BiSearch } from 'react-icons/bi'
import { useState, useEffect } from 'react'
import './MainSection.css'
import PropTypes from 'prop-types'

const baseURL = 'http://localhost:8000';

const MainSection = ({ setEmployeeId }) => {
    
    if (!setEmployeeId) {
        console.warn('setEmployeeId prop is missing');
    }

    const [ShowModal, setShowModal] = useState(false)
    const [employees, setEmployees] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

/*    const getAllEmployee = async () => {
        try {
            const res = await fetch(`${baseURL}/employee`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await res.json();
            setEmployees(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch(`${baseURL}/searchemployee/${searchQuery}`);
                const data = await res.json();
                setEmployees(data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        if (searchQuery) {
            fetchEmployees();
        } else {
            getAllEmployee();  // Fetch all employees when there's no search query.
        }
    }, [ShowModal, searchQuery]);
*/

    const getAllEmployee = async () => {
        try {
            const res = await fetch(`${baseURL}/employee`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
    
            // Update the employee data to include the correct image URL
            const updatedData = data.map(employee => ({
                ...employee,
                image: `${baseURL}${employee.image}`, // Add the full URL for the image
            }));
    
            setEmployees(updatedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllEmployee(); // Fetch employees on component mount
    }, []);
    
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch(`${baseURL}/searchemployee/${searchQuery}`);
                const data = await res.json();
    
                // Update the employee data to include the correct image URL
                const updatedData = data.map(employee => ({
                    ...employee,
                    image: `${baseURL}${employee.image}`, // Add the full URL for the image
                }));
    
                setEmployees(updatedData);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };
    
        if (searchQuery) {
            fetchEmployees();
        } else {
            getAllEmployee(); // Fetch all employees when there's no search query.
        }
    }, [ShowModal, searchQuery]);

    

    return (
        <>
            {
                ShowModal && <ModalPopUp setShowModal={setShowModal} getAllEmployee={getAllEmployee}/>
            }

            <main className="main-section">

                <div className="header">
                    <div className='total-info'><b>Total Employees: </b><span>{employees.length}</span></div>

                    <div className="search-container">
                        <input type="text" placeholder="Search by name, email, designation..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <BiSearch size={20} className='search-icon' onClick={() => setSearchQuery(searchQuery)}/>
                    </div>
                    <button className="add-button" type="button" onClick={() => setShowModal(true)}>
                        +Add Employee
                    </button>
                </div>


                <div className="employee-cards">
                    {employees.map((emp) => {
                        return <div key={emp._id} onClick={() => setEmployeeId(emp._id)}>
                            <Card empData={emp} />
                        </div>
                    })}
                </div>


            </main>
        </>
    )
}
MainSection.propTypes = {
    setEmployeeId: PropTypes.func.isRequired, // Ensure setEmployeeId is provided and is a function
};

export default MainSection
