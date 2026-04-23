import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CompaniesTable = () => {
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/company/get", {
                    withCredentials: true
                });
                if (res.data.success) {
                    setCompanies(res.data.companies);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCompanies();
    }, []);

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-200 mt-5">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Logo</th>
                        <th className="py-2 px-4 border-b text-left">Name</th>
                        <th className="py-2 px-4 border-b text-left">Date</th>
                        <th className="py-2 px-4 border-b text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.length <= 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center py-4">No companies registered yet.</td>
                        </tr>
                    ) : (
                        companies.map((company) => (
                            <tr key={company._id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">
                                    <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold'>
                                        {company.name[0]}
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b">{company.name}</td>
                                <td className="py-2 px-4 border-b">{company.createdAt.split("T")[0]}</td>
                                <td className="py-2 px-4 border-b text-right">
                                    <button 
                                        onClick={() => navigate(`/admin/companies/${company._id}`)} 
                                        className="bg-gray-100 border border-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-200">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default CompaniesTable