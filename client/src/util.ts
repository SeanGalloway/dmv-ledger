import getWeb3 from "./getWeb3";

class Util {

    public static setupContract = async (
        setWeb3Instance: (value: any) => void, 
        setAccounts: (value: any) => void, 
        setContract: (value: any) => void, 
        contractSpec: any,
        after: (
            instance: any,
            accounts: any[]
        ) => void = (instance, accounts) => {}
        ) => {
            console.log("setting up contract")
            try {
                // Get network provider and web3 instance.
                const web3 = await getWeb3();
                console.log(web3);
                // Use web3 to get the user's accounts.
                const accounts = await web3.eth.getAccounts();
                console.log(accounts);
                // Get the contract instance.
                // const networkId: string = await web3.eth.net.getId();
                const deployedNetwork: any = contractSpec.networks["5777"];
                const instance = await new web3.eth.Contract(
                    contractSpec.abi,
                    deployedNetwork && deployedNetwork.address,
                );
                console.log(String(instance));
                // Set web3, accounts, and contract to the state, and then proceed with an
                // example of interacting with the contract's methods.
                setWeb3Instance(web3);
                setAccounts(accounts);
                setContract(instance);

                await after(instance, accounts);
            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
            }
        }
}

export default Util;