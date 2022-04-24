// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <8.10.0;

pragma experimental ABIEncoderV2;

contract Registrations {
    struct Registration {
        uint expirationDate;
        address owner;
    }

    mapping(bytes => Registration) registrations;

    function registerVehicle(bytes memory vin) public payable {
        require(msg.value == 0.025 ether);

        Registration memory r;
        
        r.owner = msg.sender;
        r.expirationDate = block.timestamp + (365 days);
        registrations[vin] = r;
    }

    function getRegistrations(bytes memory vin) public payable returns (Registration memory) {
        return registrations[vin];
    }

    function cancelRegistration(bytes memory vin) public payable {
        if (registrations[vin].owner == msg.sender) {
            delete registrations[vin];
        }
    }
}