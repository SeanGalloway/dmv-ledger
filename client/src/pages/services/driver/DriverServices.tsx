import React, { useState, useEffect } from "react";
import LicensesContract from "../../../contracts/Licenses.json";
import Util
 from "../../../util";
const DriverServices = () => {

    const [myLicense, setMyLicense] = useState<object>();

    const [newCorrectLenseRes, setNewCorrectiveLenseRes] = useState(false)
    const [newRealId, setNewRealId] = useState(false);

    const [renewCorrectLenseRes, setRenewCorrectiveLenseRes] = useState(false)
    const [renewRealId, setRenewRealId] = useState(false);

    const [newAddress, setNewAddress] = useState("");

    const [recordType, setRecordType] = useState(0);
    const [record, setRecord] = useState<object>();
    const [web3Instance, setWeb3Instance] = useState<any>();
    const [accounts, setAccounts] = useState<any>();
    const [contract, setContract] = useState<any>();

    const [newProfile, setNewProfile] = useState<{
        firstName?: string,
        lastName?: string,
        address?: string,
        for?: string
    }>();

    const [newVitalRecord, setNewVitalRecord] = useState<{
        recordType?: number,
        date?: Date,
        for?: string
    }>();

    const setupContract = async () => {
        if (!contract && !web3Instance)
            await Util.setupContract(setWeb3Instance, setAccounts, setContract, LicensesContract, 
                async (
                    instance, accounts
                ) => {
                    const license = await instance.methods.getLicense().call({ from: accounts[0]});
                    console.log(license);
                    setMyLicense(license);
                }
            );
    };

    const getPrice = (realId: boolean): number => {
        return realId ? 0.02 : 0.015
    }

    useEffect(() => {
        setupContract();
    });

    const newDriversLicense = () => {
        contract.methods.newLicense(
            newCorrectLenseRes,
            newRealId
        ).send({from: accounts[0], value: web3Instance.utils.toWei('0.015', 'ether')});
    };

    const renewDriversLicense = () => {
        contract.methods.renewLicense(
            renewCorrectLenseRes,
            renewRealId
        ).send({from: accounts[0], value: web3Instance.utils.toWei(getPrice(newRealId), 'ether')});
    };

    const updateAddress = () => {
        contract.methods.updateAddress(
            web3Instance.utils.asciiToHex(newAddress)
        ).send({from: accounts[0]});
    };

    const getVitalRecord = async () => {
        const record = await contract.methods.getVitalRecord(
            recordType,
            accounts[0]
        ).call({from: accounts[0]});

        setRecord(record);
    };

    const addProfile = async () => {
        if (newProfile)
            contract.methods.addProfile(
                web3Instance.utils.asciiToHex(newProfile.firstName),
                web3Instance.utils.asciiToHex(newProfile.lastName),
                web3Instance.utils.asciiToHex(newProfile.address),
                newProfile.for,
            ).send({from: accounts[0]});
    };

    const addVitalRecord = async () => {
        if (newVitalRecord)
        contract.methods.saveVitalRecord(
            newVitalRecord.recordType,
            newVitalRecord.date?.getTime(),
            newVitalRecord.for,
        ).send({from: accounts[0]});
    };

    return (
        <>
            <h1>
                Driver Services
            </h1>
            <h2>My Driver's license</h2>
            <div>
                {
                    myLicense && JSON.stringify(myLicense)
                }
            </div>
            <h2>
                Apply for Driver's license
            </h2>
            <div>
                <label>RealId</label>
                <input type={"checkbox"} onChange={(e) => {
                    setNewRealId(e.target.checked);
                    }}></input>
                <label>Corrective Lense Restriction</label>
                <input type={"checkbox"} onChange={(e) => {
                setNewCorrectiveLenseRes(e.target.checked);
                }}/>
                <h3>Price: {getPrice(newRealId)} ETH</h3>
                <button onClick={newDriversLicense}>Apply</button>
            </div>
            <h2>
                Renew Driver's License
            </h2>
            <div>
                <label>RealId</label>
                <input type={"checkbox"} onChange={(e) => {
                    setRenewRealId(e.target.checked);
                    }}></input>
                <label>Corrective Lense Restriction</label>
                    <input type={"checkbox"} onChange={(e) => {
                    setRenewCorrectiveLenseRes(e.target.checked);
                    }}/>
                <h3>Price: {getPrice(renewRealId)} ETH</h3>
                <button onClick={renewDriversLicense}>Apply</button>
            </div>

            <h2>Update Address</h2>
            <div>
                <label>New Address</label>
                <input onChange={(e) => {setNewAddress(e.target.value)}}></input>
                <button onClick={updateAddress}>Update</button>
            </div>
            <h2>Obtain Vital Record</h2>
            <div>
                <div>
                    <input onChange={(e) => {setRecordType(parseInt(e.target.value));}} type="radio" id="birth" name="recordType" value="0"/>
                    <label htmlFor="birth">Birth Certificate</label><br/>
                    <input onChange={(e) => {setRecordType(parseInt(e.target.value));}} type="radio" id="marriage" name="recordType" value="1"/>
                    <label htmlFor="marriage">Marriage Certificate</label><br/>
                    <button onClick={getVitalRecord}>Request</button>
                </div>
                {record && (
                    <div>
                        {JSON.stringify(record)}
                    </div>
                )}
            </div>
            <h1>Admin Changes</h1>
            <h2>Add driver profile</h2>
            <div>
                <label>First Name</label>
                <input onChange={(e) => {setNewProfile({...newProfile, firstName: e.target.value})}}></input>
                <label>Last Name</label>
                <input onChange={(e) => {setNewProfile({...newProfile, lastName: e.target.value})}}></input>
                <label>Street Address</label>
                <input onChange={(e) => {setNewProfile({...newProfile, address: e.target.value})}}></input>
                <label>For Citizen</label>
                <input onChange={(e) => {setNewProfile({...newProfile, for: e.target.value})}}></input>
                <button onClick={addProfile}>Add</button>
            </div>
            <h2>Add vital record</h2>
            <div>
                <input onChange={(e) => {setNewVitalRecord({...newVitalRecord, recordType: parseInt(e.target.value)});}} type="radio" id="birth" name="recordType" value="0"/>
                <label htmlFor="birth">Birth Certificate</label><br/>
                <input onChange={(e) => {setNewVitalRecord({...newVitalRecord, recordType: parseInt(e.target.value)});}} type="radio" id="marriage" name="recordType" value="1"/>
                <label htmlFor="marriage">Marriage Certificate</label><br/>
                <label>date</label>
                <input type={"date"} onChange={(e) => {setNewVitalRecord({...newVitalRecord, date: new Date(e.target.value)});}}></input>
                <label>For Citizen</label>
                <input onChange={(e) => {setNewVitalRecord({...newVitalRecord, for: e.target.value});}}></input>
                <button onClick={addVitalRecord}>Request</button>
            </div>
        </>
    )
};

export default DriverServices;