import Web3 from "web3";

let contract;
let abi = require("./abi.json");
let isInitialized = false;
const web3 = new Web3(window.ethereum);
const initialize = () => {
  contract = new web3.eth.Contract(
    abi,
    process.env.REACT_APP_ERC20_CONTRACT_ADDRESS
  );
  isInitialized = true;
};

export const 메타마스크연결 = async () => {
  try {
    let addressArray;
    addressArray = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const obj = {
      address: addressArray[0],
      success: true,
    };
    return obj;
  } catch (err) {
    return {
      address: "",
      success: false,
    };
  }
};

export const 밸런스확인 = async (address) => {
  if (!isInitialized) initialize();
  const res = await contract.methods.balanceOf(address).call();
  return res;
};

export const 토큰송금 = async (address, amount) => {
  if (!isInitialized) initialize();

  let estimateGas = await web3.eth.estimateGas({
    data: contract.methods
      .transfer("0x61DF8CE3cbb13B954D968F60F7FfF3b3D743e469", amount)
      .encodeABI(),
    from: address,
    to: "0x61DF8CE3cbb13B954D968F60F7FfF3b3D743e469",
  });
  const parameter = {
    to: "0x61DF8CE3cbb13B954D968F60F7FfF3b3D743e469",
    from: address,
    data: contract.methods
      .transfer("0x61DF8CE3cbb13B954D968F60F7FfF3b3D743e469", amount)
      .encodeABI(),
    gas: estimateGas.toString(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [parameter],
    });
    return {
      success: true,
      hash: txHash,
    };
  } catch (err) {
    return {
      success: false,
      hash: "",
    };
  }
};
