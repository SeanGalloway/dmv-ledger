var licenses = artifacts.require("./Licenses.sol");
var registrations = artifacts.require("./Registrations.sol");
var vehicleServices = artifacts.require("./VehicleServices.sol");

module.exports = function(deployer) {
  deployer.deploy(licenses);
  deployer.deploy(registrations);
  deployer.deploy(vehicleServices);
};
