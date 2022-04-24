import React, { useEffect, useState } from "react";
import TitleVehicleContract from "../../../contracts/VehicleServices.json";
import Util from "../../../util";

const VehicleServices = () => {
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState(0);
    const [color, setColor] = useState("");
    const [vin, setVin] = useState("");
    const [web3Instance, setWeb3Instance] = useState<any>();
    const [accounts, setAccounts] = useState<any>();
    const [contract, setContract] = useState<any>();

    const [saleVin, setSaleVin] = useState("");
    const [buyer, setBuyer] = useState("0x");

    const [revokeVin, setRevokeVin] = useState("");

    const [myVehicles, setMyVehicles] = useState([]);

    useEffect(() => {
        const setupContract = async () => {
            if (!contract) {
                await Util.setupContract(setWeb3Instance, setAccounts, setContract, TitleVehicleContract, async (
                    instance, accounts
                ) => {
                    const vehicles = await instance.methods.getVehicles().call({ from: accounts[0]});
                    console.log(vehicles);
                    setMyVehicles(vehicles);
                });
            } else {
                const vehicles = await contract.methods.getVehicles().call({ from: accounts[0]});
                console.log(vehicles);
                setMyVehicles(vehicles);
            }
    
        };

        setupContract();
    }, [accounts, contract]);

    const addVehicle = async () => {
        await contract.methods.title(
            year,
            make,
            model,
            color,
            web3Instance.utils.asciiToHex(vin)
        ).send({ from: accounts[0], value: web3Instance.utils.toWei('0.015', 'ether') });


    };

    const sellVehicle = async () => {
        await contract.methods.sellVehicle(
            web3Instance.utils.asciiToHex(saleVin),
            buyer,
        ).send({from: accounts[0], value: web3Instance.utils.toWei('0.03', 'ether')});
    };

    const revokeTitle = async () => {
        await contract.methods.revokeTitle(
            web3Instance.utils.asciiToHex(revokeVin)
        ).send({from: accounts[0], value: web3Instance.utils.toWei('0.015', 'ether')});
    }

    return (
        <>
        <h1>
                Vehicles services
            </h1>
            <h2>Title New Vehicle (0.015 ETH)</h2>
            <div id="title-form">
                <label>Make</label>
                <input onChange={(e) => {setMake(e.target.value)}}></input>
                <label>Model</label>
                <input onChange={(e) => {setModel(e.target.value)}}></input>
                <label>Year</label>
                <input defaultValue={2022} type={"number"} onChange={(e) => {setYear(parseInt(e.target.value))}}></input>
                <label>Color</label>
                <input onChange={(e) => {setColor(e.target.value)}}></input>
                <label>VIN</label>
                <input onChange={(e) => {setVin(e.target.value)}}></input>
                <div>
                    <button className="btn btn-primary" onClick={addVehicle}>
                        Add Vehicle
                    </button>
                </div>
            </div>
        <h2>Transfer title (0.03 ETH)</h2>
            <div>
                <label className="form-label">VIN</label>
                <input className="form-control" onChange={(e) => {setSaleVin(e.target.value)}}></input>
                <label htmlFor="buyerInput" className="form-label">Address to sell it to</label>
                <input id="buyerInput" className="form-control" onChange={(e) => {setBuyer(e.target.value)}}></input>
                <div>
                    <button className="btn btn-primary" onClick={sellVehicle}>Sell</button>
                </div>
            </div>
            <h2>Revoke Title (0.015 ETH)</h2>
            <div>
                <label className="form-label">VIN</label>
                <input  className="form-control" onChange={(e) => {setRevokeVin(e.target.value)}}></input>
                <div>
                    <button className="btn btn-primary" onClick={revokeTitle}>Revoke</button>
                </div>
            </div>
        
            <h2>My Vehicles</h2>
            <div>
                {myVehicles.map(element => 
                    <li key={element}>
                        {JSON.stringify(element)}
                    </li>
                )}
            </div>
        </>
    );
};

export default VehicleServices;