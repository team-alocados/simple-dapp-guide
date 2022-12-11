# Alocados Simple dApp Guide

이 가이드는 알로카도스 입사자 분들을 위한 간단한 dApp(중앙화 어플리케이션)의 가이드라인입니다.

문서를 보시기에 앞서 노션의 <b>dApp 가이드 진행을 위한 절차</b>를 진행하지 않으셨다면, 먼저 진행해주시기를 바랍니다 !

프로젝트를 통해 3가지 기능을 구현할 예정입니다.

1. 메타마스크와 연동하기

2. 지갑에 송금된 Token 확인하기

3. 다른 지갑으로 송금하기

---
### How to start
```
yarn 
yarn start
```

```
.env file
REACT_APP_CONTRACT_ADDRESS="0x277541F974fe1A07e9723AF6845Dd1417a527E9d"
```

### Detail

1. window.ethereum

자바스크립트의 모든 객체, 전역 함수, 전역 변수들은 자동으로 window 객체의 property로 생성이 됩니다.

window.ethereum은 메타마스크/코인베이스 지갑  extension이 chrome browser에 설치될 시 자동으로 생성되는 property 입니다.

window.ethereum을 통해 지갑으로의 요청을 처리할 수 있습니다.

window.ethereum은 여러 문서에서 <b>provider</b>로 지칭합니다.


2. web3.js

블록체인과 원활한 소통을 위해 사용되는 라이브러리입니다.

```js
import Web3 from "web3"

const web3 = new Web3(window.ethereum)
```

ethereum 블록체인에 올라가있는 smart contract와의 연결을 위해 web3 객체를 생성하여줍니다.


### Function

1. 메타마스크 지갑연결하기
```js
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
```

- window.ethereum 객체 내에 존재하는 request function을 사용해서 지갑주소를 요청할 수 있습니다.

- 지갑주소 요청을 위해 eth_requestAccounts method를 사용했고, 첫 번째 배열에 지갑주소가 return 됩니다.


2. Contract 읽어오기

- Web3 객체를 통해 생성된 smart contract는 javascript 내 객체처럼 사용할 수 있습니다.

```js
import Web3 from "web3";

let contract;
let isInitialized = false;
const web3 = new Web3(window.ethereum); 
const initialize = () => {
  contract = new web3.eth.Contract(
    erc20Abi,
    process.env.REACT_APP_ERC20_CONTRACT_ADDRESS
  );
  isInitialized = true;
};
```

- initialize를 통해 contract를 생성해줍니다.

- contract를 생성할 때, contract json Interface와 contract address가 필요합니다.

3. Get Token Balance 

- contract 내 method에 접근할 때 call function을 사용합니다.

- abi를 확인해보시면, balanceOf method는 지갑주소 인자를 요구하고 있습니다.

```json
{
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
```



```js
export const 밸런스확인 = async (address) => {
  if (!isInitialized) initialize();
  const res = await contract.methods.balanceOf(address).call();
  return res;
};
```

4. Transfer 실행

- 수신지갑주소:0x61DF8CE3cbb13B954D968F60F7FfF3b3D743e469

- transaction(거래)에 앞서 수수료계산이 먼저 필요합니다.

- estimateGas: 수수료 계산 function
  
  - data: 사용자가 발생시키고자 하는 거래내용
  
  - from: 사용자 지갑
  
  - to: 수신 지갑
  
- 거래 parameter 생성
   
  - data: 사용자가 발생시키고자 하는 거래내용
  
  - from: 사용자 지갑
  
  - to: 수신 지갑
  
  - gas: estimateGas에서 return된 값
  
- sendTransaction

  - 지갑연결때와 비슷하게, window.ethereum.reqeust를 통해 eth_sendTransaction method를 호출합니다.
  - transaction에 필요한 거래내용을 담은 parameter를 2번째 인자로 사용합니다.
  
```js
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
```
  
    
- transaction hash

   - 모든 transaction은 영수증을 return 시킵니다.
   
   - transaction hash는 web3에서 영수증이며, etherscan과 같은 스캔사이트를 통해 거래내역을 확인할 수 있습니다.
