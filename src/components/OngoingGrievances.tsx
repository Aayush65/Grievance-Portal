import { useContext, useEffect, useState } from "react";
import { getAccessToken } from "../utils/getAccessToken";
import { context } from "../context";
import { dropdown } from "../assets";
import LoadingSpinner from "./LoadingSpinner";

interface complaintType {
    _id: string;
    subject: string;
    complaint: string;
    relatedDepts: string[];
    status: string;
    remarks: string[][];
}

const OngoingGrievances = () => {
    const [ complaints, setComplaints ] = useState<complaintType[]>([]);
    const [ activeComplaintIndex, setActiveComplaintIndex ] = useState<number>(-1);

    const { setName, setEmpNo, setRegNo, setIsSuperUser } = useContext(context);
    
    //fetches all the complaints from the server
    useEffect(() => {
        async function fetchData() {
            try {
                const headers = {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-type': 'application/json; charset=UTF-8',
                }
                const response = await fetch(`https://grievance-server.aayush65.com/grievances`, { method: 'GET', headers})
                const data = await response.json();
                if (data.message && data.message === "Unauthorised Access") {
                    const values = await getAccessToken();
                    if (values) {
                        setName(values.name);
                        setEmpNo(values.empNo);
                        setRegNo(values.regNo);
                        setIsSuperUser(values.isSuperUser);
                        fetchData();
                    }
                    return;
                } else if (data) {
                    if (data.length === 0)
                        data.push({_id: '0'});
                    setComplaints(data);
                }
            } catch(err) {
                console.error(err);
            };
        }
        fetchData();
    }, []);

    function handleActiveComplaints(index: number) {
        if (activeComplaintIndex === index)
            setActiveComplaintIndex(-1);
        else
            setActiveComplaintIndex(index);
    }

    return (
        <div className="max-w-screen min-h-screen px-4 py-20 md:p-20 flex flex-col justify-center items-center">
            <h1 className="p-5 md:p-10 text-xl md:text-2xl font-semibold">{
                complaints.length && complaints[0]._id === '0' ? "You have no complaints" : 
                complaints.length ? "Your complaints" : 
                <div className="flex gap-3"><LoadingSpinner />Loading...</div> 
            }</h1>
            <div className="w-full md:w-4/5 lg:w-2/3">
                {complaints.map((complaint, index) => (
                    <div key={index} className="flex flex-col" >
                        <div className={`flex items-center justify-around p-2 md:p-4 border-black border-2 rounded-xl text-sm md:text-base cursor-pointer ${complaint._id === '0' ? "hidden": ""} ${activeComplaintIndex === index ? "bg-[#bbd8e2]": "" }`} onClick={() => handleActiveComplaints(index)} >
                            <div className={`w-[20%] truncate text-ellipsis`}>{complaint._id}</div>
                            <div className={`w-[40%] truncate text-ellipsis`}>{complaint.subject}</div>
                            <div className={`group w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center transition duration-300 ${complaint.status === "pending" ? "bg-red-500" : complaint.status === "seen" ? "bg-orange-500" : complaint.status === "opened" ? 'bg-yellow-500' : `bg-green-500`}`}><span className="hidden bg-gray-600 text-white p-1 rounded-lg md:group-hover:block transform -translate-y-8">{complaint.status}</span></div>
                            <img src={dropdown} alt="dropdown" className={`w-[5%] ${activeComplaintIndex === index ? "invisible" : ""}`} />
                        </div>
                        <div className={`${activeComplaintIndex === index ? "bg-[#bbd8e2]" : "hidden"} flex flex-col items-start justify-center py-2 md:py-6 px-4 md:px-10 border-black border-2 rounded-xl text-sm md:text-base gap-1`}>
                            {[
                                { title: "Complaint Id:", value: complaint._id },
                                { title: "Status:", value: complaint.status },
                                { title: "Tags:", value: String(complaint.relatedDepts) },
                                { title: "Subject:", value: complaint.subject },
                                { title: "Content:", value: complaint.complaint },
                             ].map((values, index) => (
                                <div key={index} className={`w-full flex items-center ${values.title === "Status:" ? "md:hidden" : "" }`}>
                                    <div className="w-[30%] md:w-[15%] font-bold">{values.title}</div>
                                    <div className="max-w-[70%]">{values.value}</div>
                                </div>
                            ))}
                            {complaint.remarks ? <div className="w-full flex">
                                <div className="w-[33%] md:w-[15%] font-bold">Remarks:</div>
                                <div className="max-w-[67%] flex flex-col">
                                    {complaint.remarks.map((remark, index) => (
                                        <div key={index}>{remark[0] + " - " + remark[1]}</div>
                                    ))}
                                </div>
                            </div> : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OngoingGrievances;