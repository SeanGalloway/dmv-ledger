// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <8.10.0;
pragma experimental ABIEncoderV2;

contract Licenses {
    struct License {
        uint expirationDate;
        bool correctiveLensesRestriction;
        bool realId;
    }

    enum CertificateType {BIRTH, MARRIAGE}

    struct VitalRecord {
        CertificateType certificateType;
        bool isValue;
        uint128 date;
    }

    struct Profile {
        bool isValue;
        bytes firstName;
        bytes lastName;
        bytes streetAddress;
        License license;
        VitalRecord birthCertificate;
        VitalRecord marriageCertificate;
    }

    mapping(address => Profile) profiles;

    function newLicense(bool correctiveLensesRestriction, bool realId) public payable {
        require(msg.value == 0.015 ether);
        require(profiles[msg.sender].isValue, "no profile for address");

        License memory l;

        l.expirationDate = block.timestamp + (10 * 365 days);
        l.correctiveLensesRestriction = correctiveLensesRestriction;
        l.realId = realId;

        profiles[msg.sender].license = l;
    }

    function renewLicense(bool correctiveLensesRestriction, bool realId) public payable {
        if (realId)
            require(msg.value == 0.02 ether);
        else 
            require(msg.value == 0.015 ether);

        require(profiles[msg.sender].isValue, "no profile for address");

        profiles[msg.sender].license.expirationDate = block.timestamp + (10 * 365 days);
        profiles[msg.sender].license.realId = realId;
        profiles[msg.sender].license.correctiveLensesRestriction = correctiveLensesRestriction;
    }

    function updateAddress(bytes memory newStreetAddress) public payable {
        profiles[msg.sender].streetAddress = newStreetAddress;
    }

    function getLicense() public view returns (License memory) {
        return profiles[msg.sender].license;
    }

    function getVitalRecord(uint8 recordType, address forCitizen) public view returns (VitalRecord memory) {
        require(recordType <= uint8(CertificateType.MARRIAGE));
        if (CertificateType(recordType) == CertificateType.BIRTH) {
            return profiles[forCitizen].birthCertificate;
        }
        else {
            return profiles[forCitizen].marriageCertificate;
        }
    }

    function addProfile(
        bytes memory firstName,
        bytes memory lastName,
        bytes memory streetAddress,
        address forCitizen
    ) public payable {
        require(!profiles[forCitizen].isValue);

        Profile memory p;

        p.isValue = true;
        p.firstName = firstName;
        p.lastName = lastName;
        p.streetAddress = streetAddress;
        profiles[forCitizen] = p;
    }

    function saveVitalRecord(
        uint8 recordType,
        uint128 date,
        address forCitizen
    ) public payable {
        require(profiles[forCitizen].isValue);
        if (CertificateType(recordType) == CertificateType.BIRTH) {
            require(!profiles[forCitizen].birthCertificate.isValue);
            VitalRecord memory vr;

            vr.isValue = true;
            vr.certificateType = CertificateType.BIRTH;
            vr.date = date;
            profiles[forCitizen].birthCertificate = vr;
        }
        else if (CertificateType(recordType) == CertificateType.MARRIAGE) {
            require(!profiles[forCitizen].marriageCertificate.isValue);
            VitalRecord memory vr;

            vr.isValue = true;
            vr.certificateType = CertificateType.MARRIAGE;
            vr.date = date;
            profiles[forCitizen].marriageCertificate = vr;
        }
    }
}