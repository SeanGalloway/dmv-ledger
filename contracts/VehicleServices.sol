// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <8.10.0;
pragma experimental ABIEncoderV2;

contract VehicleServices {
    struct Title {
        bool isValue;
        uint year;
        string make;
        string model;
        string color;
        address payable owner;
    }

    mapping(bytes => Title) titles;
    mapping(address => bytes[]) findVinsByOwner;


    function title(
        uint year,
        string memory make,
        string memory model,
        string memory color,
        bytes memory vin
    ) public payable {
        require(msg.value == 0.015 ether);
        Title memory t;
        t.isValue = true;
        t.color = color;
        t.make = make;
        t.model = model;
        t.year = year;
        t.owner = payable(msg.sender);

        findVinsByOwner[msg.sender].push(vin);
        titles[vin] = t;
    }

    function getVehicles() public view returns (Title[] memory) {
        bytes[] memory userVins = findVinsByOwner[msg.sender];
        

        uint16 numberOfVehicles = 0;

        for (uint256 index = 0; index < userVins.length; index++) {
            if (titles[userVins[index]].isValue) {
                numberOfVehicles++;
            }
        }

        Title[] memory userTitles = new Title[](numberOfVehicles);
        numberOfVehicles = 0;
        for (uint256 index = 0; index < userVins.length; index++) {
            if (titles[userVins[index]].isValue) {
                userTitles[numberOfVehicles] = titles[userVins[index]];
                numberOfVehicles++;
            }
        }

        return userTitles;
    }



    function revokeTitle(bytes memory vin) public payable {
        require(titles[vin].owner == msg.sender);
        require(msg.value == 0.015 ether);

        delete titles[vin];

        bytes[] memory currentOwnerVins = findVinsByOwner[msg.sender];

        for (uint16 i = 0; i < currentOwnerVins.length; i++) {
            if (keccak256(currentOwnerVins[i]) == keccak256(vin)) {
                delete currentOwnerVins[i];
            }
        }
    }

    function sellVehicle(bytes memory vin, address payable buyer) external payable {
        require(titles[vin].owner == msg.sender);
        require(msg.value == 0.03 ether);


        bytes[] memory currentOwnerVins = findVinsByOwner[msg.sender];

        for (uint16 i = 0; i < currentOwnerVins.length; i++) {
            if (keccak256(currentOwnerVins[i]) == keccak256(vin)) {
                delete currentOwnerVins[i];
            }
        }

        titles[vin].owner = buyer;
        findVinsByOwner[buyer].push(vin);
    }

    
}