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

```
import Web3 from "web3"

const web3 = new Web3(window.ethereum)
```

ethereum 블록체인에 올라가있는 smart contract와의 연결을 위해 web3 객체를 생성하여줍니다.
