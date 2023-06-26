import { FormEvent, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import encrypt from "../utils/encrypt";

const Login = () => {
    const [regNo, setRegNo] = useState("");
    const [pass, setPass] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        if (!isSubmit)
            return;
        console.log(pass);
        fetch(`http://localhost:3000/login/${regNo}/${pass}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {console.log(response);response.json()})
            .then((data) => console.log(data))
            .catch((err) => {
                console.log(err.message);
            })
            .finally(handleReset);

    }, [isSubmit])

    const loginDetails = [
        { name: "Registration Number", value: regNo, funct: setRegNo, placeholder: "Enter your Registration No" },
        { name: "Password", value: pass, funct: setPass, placeholder: "Enter your Password" },
    ];

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!regNo || !pass)
            return;
        const newPass = await encrypt(pass);
        setPass(newPass);
        setIsSubmit(true);
    }

    function handleReset() {
        setRegNo('');
        setPass('');
    }

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#EEEEEE] p-3">
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center bg-[#3A98B9] py-10 px-7 md:p-10 md:pb-7 gap-5 text-[#FFF1DC] rounded-3xl w-full md:w-auto">
                {loginDetails.map((detail, index) => (
                    <label key={index} className="flex flex-col gap-1 md:text-lg w-full">
                        {detail.name}
                        <input className="p-2 rounded-xl placeholder:text-gray-400 md:w-[400px] text-black" onChange={(e) => detail.funct(e.target.value)} type={detail.name.toLowerCase()} placeholder={detail.placeholder} />
                        <div className="flex justify-between">
                            <Link to="/register" className={`hover:underline self-end text-[13px] md:text-base ${detail.name === "Password" ? "": "hidden"}`}>Forgot Password?</Link>
                            <Link to="/register" className={`hover:underline self-start text-[13px] md:text-base ${detail.name === "Password" ? "": "hidden"}`}>Register Here</Link>
                        </div>
                    </label>
                ))}
                <button type="submit" className="bg-gray-700 p-3 px-4 rounded-xl md:text-lg">Submit</button>
            </form>
        </div>
    )
}

export default Login;