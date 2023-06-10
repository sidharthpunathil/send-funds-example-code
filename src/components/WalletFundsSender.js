import React, { useState } from 'react';
const { ethers } = require("ethers");

const WalletFundsSender = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');

  const connectToMetaMask = async () => {
    console.log("inside ")
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request access to the user's MetaMask accounts
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("done")
      } catch (error) {
        console.log('Error connecting to MetaMask:', error);
      }
    } else {
      console.log('MetaMask is not installed.');
    }
  };

  const sendFunds = async (event) => {
    event.preventDefault();


    if (typeof window.ethereum !== 'undefined') {
      try {
        // Check if the user is connected to MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        console.log(accounts)

        if (accounts.length === 0) {
          console.log('Please connect to MetaMask.');
          return;
        }

        // Create a new ethers.js provider from MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Create a transaction object
        const transaction = {
          to: walletAddress,
          value: ethers.utils.parseEther(amount)
        };

        // Sign and send the transaction using MetaMask
        const tx = await signer.sendTransaction(transaction);

        // Wait for the transaction to be mined
        await tx.wait();

        // Reset the form
        setWalletAddress('');
        setAmount('');
      } catch (error) {
        console.log('Error sending funds:', error);
      }
    } else {
      console.log('MetaMask is not installed.');
    }
  };

  return (
    <div>
      <h2>Send Funds to Wallet</h2>
      <button onClick={connectToMetaMask}>Connect to MetaMask</button>
      <form onSubmit={sendFunds}>
        <div>
          <label htmlFor="walletAddress">Wallet Address:</label>
          <input
            type="text"
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Funds</button>
      </form>
    </div>
  );
};

export default WalletFundsSender;
