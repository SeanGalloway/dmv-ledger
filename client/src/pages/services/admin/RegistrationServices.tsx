import React, { useEffect, useState } from "react";
import RegistrationsContract from  "../../../contracts/Registrations.json";
import Util from "../../../util";

const RegistrationServices = () => {

    const [applicationVin, setApplicationVin] = useState("");
    
    const [renewalVin, setRenewalVin] = useState("");

    const [web3Instance, setWeb3Instance] = useState<any>();
    const [accounts, setAccounts] = useState<any>();
    const [contract, setContract] = useState<any>();

    const [registrationVin, setRegistrationVin] = useState("");
    const [registration, setRegistration] = useState<object>();

    useEffect(() => {
        const setupContract = async () => {
            await Util.setupContract(setWeb3Instance, setAccounts, setContract, RegistrationsContract);
        }

        setupContract();
    }, []);

    const submitRegistration = async () => {
        contract.methods.registerVehicle(
            web3Instance.utils.asciiToHex(applicationVin)
        ).send({ from: accounts[0], value: web3Instance.utils.toWei('0.025', 'ether') });
    };

    const submitRegistrationRenewal = async () => {
        contract.methods.registerVehicle(
            web3Instance.utils.asciiToHex(renewalVin)
        ).send({ from: accounts[0], value: web3Instance.utils.toWei('0.025', 'ether') });
    };

    const getRegistration = async () => {
        const myRegistration = await contract.methods.getRegistrations(
            web3Instance.utils.asciiToHex(registrationVin)
        ).call({ from: accounts[0]});
        console.log(myRegistration);
        setRegistration(myRegistration);
    };

    return (
        <>
            <h1>
                Registration Services
            </h1>
            <h2>Register Vehicle (0.025 ETH)</h2>
            <div>
                <label>VIN</label>
                <input onChange={(e) => {setApplicationVin(e.target.value)}}/>
                <button onClick={submitRegistration}>Register</button>
            </div>
            <h2>Renew Registration (0.025 ETH)</h2>
            <div>
                <label>VIN</label>
                <input onChange={(e) => {setRenewalVin(e.target.value)}}/>
                <button onClick={submitRegistrationRenewal}>Renew Registration</button>
            </div>
            <h2>
                View registration
            </h2>
            <div>
                <label>VIN</label>
                <input onChange={(e) => {setRegistrationVin(e.target.value)}}></input>
                <button onClick={getRegistration}>Get</button>
                <div>
                    {registration && JSON.stringify(registration)}
                </div>
            </div>
        </>
    );
};

export default RegistrationServices;