import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ApplicantsTable = () => {
    const params = useParams();
    const [applicants, setApplicants] = useState([]);
    const shortListingStatus = ["Accepted", "Rejected"];

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/application/${params.id}/applicants`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setApplicants(res.data.job.applications);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchApplicants();
    }, []);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`http://localhost:8000/api/v1/application/status/${id}/update`, { status });
            if (res.data.success) {
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>Applicants ({applicants.length})</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Full Name</th>
                                <th className="py-2 px-4 border-b text-left">Email</th>
                                <th className="py-2 px-4 border-b text-left">Contact</th>
                                <th className="py-2 px-4 border-b text-left">Date</th>
                                <th className="py-2 px-4 border-b text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants && applicants.map((item) => (
                                <tr key={item._id} className='hover:bg-gray-50'>
                                    <td className="py-2 px-4 border-b">{item?.applicant?.fullname}</td>
                                    <td className="py-2 px-4 border-b">{item?.applicant?.email}</td>
                                    <td className="py-2 px-4 border-b">{item?.applicant?.phoneNumber}</td>
                                    <td className="py-2 px-4 border-b">{item?.createdAt.split("T")[0]}</td>
                                    <td className="py-2 px-4 border-b text-right">
                                        <div className='flex justify-end gap-2'>
                                            {shortListingStatus.map((status, index) => {
                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => statusHandler(status, item._id)}
                                                        className={`text-xs px-3 py-1 rounded-md text-white ${status === "Accepted" ? "bg-green-600" : "bg-red-600"}`}>
                                                        {status}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ApplicantsTable