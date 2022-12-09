import "./App.css";
import React, { useState } from "react";
import { Container, Grid } from "@mui/material";
import { 메타마스크연결, 밸런스확인, 토큰송금 } from "./controller";

function App() {
  const [balance, setBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [txHash, setTxHash] = useState("");

  const 지갑연결 = async () => {
    const res = await 메타마스크연결();
    if (res.success) setWalletAddress(res.address);
  };

  const 밸런스체크 = async () => {
    const res = await 밸런스확인(walletAddress);
    setBalance(res);
  };

  const 토큰송금하기 = async () => {
    const res = await 토큰송금(walletAddress, 100);
    if (res.success) setTxHash(res.hash);
  };

  const 이더스캔확인 = () => {
    if (txHash === "") alert("NO TxHash, Please Try Transfer Token !");
    else window.open("https://sepolia.etherscan.io/tx/" + txHash);
  };

  return (
    <div className="App">
      <Container
        sx={{ minHeight: "100vh", display: "flex", alginItems: "center" }}
      >
        <Grid container spacing={4} item xs={6} sx={{ margin: "auto" }}>
          <Grid item xs={12}>
            <span>Wallet Address: {walletAddress}</span>
          </Grid>
          <Grid item xs={12}>
            <span>Test Token Balance: {balance / 10 ** 18}</span>
          </Grid>
          <Grid
            container
            item
            xs={12}
            alignItems="center"
            justifyContent="space-between"
          >
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                wordBreak: "break-all",
                display: "block",
                maxWidth: "80%",
              }}
            >
              Transaction Hash: {txHash}
            </span>
            <button
              style={{
                borderRadius: "12px",
                padding: "8px 12px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#6b4fff",
              }}
              onClick={이더스캔확인}
            >
              거래내역확인
            </button>
          </Grid>
          <Grid item xs={12}>
            <button
              style={{
                borderRadius: "12px",
                padding: "16px 24px",
                width: "100%",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#6b4fff",
              }}
              onClick={지갑연결}
            >
              Connect Metamask
            </button>
          </Grid>
          <Grid item xs={12}>
            <button
              style={{
                borderRadius: "12px",
                padding: "16px 24px",
                width: "100%",
                backgroundColor: "#6b4fff",
                border: "none",
                cursor: "pointer",
              }}
              onClick={밸런스체크}
            >
              Get Token Balance
            </button>
          </Grid>
          <Grid item xs={12}>
            <button
              style={{
                borderRadius: "12px",
                padding: "16px 24px",
                width: "100%",
                backgroundColor: "#6b4fff",
                border: "none",
                cursor: "pointer",
              }}
              onClick={토큰송금하기}
            >
              Transfer Token
            </button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
