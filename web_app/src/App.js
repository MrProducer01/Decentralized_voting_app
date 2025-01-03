import React, {useState, useEffect} from 'react';
import './App.css';
import VoterComponent from './component/voter_component';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminComponent from './component/admin_component';
import {connectWeb3Metamask} from './web3_functions'
import detectEthereumProvider from '@metamask/detect-provider';

function App() {

  const [contractInstance, setContract] = useState(null)
  const [accounts, setAccounts] = useState()

  useEffect(()=>{ 
    async function connect(){
      const provider = await detectEthereumProvider();
      try {
        if (provider) {
          console.log("Metamask found");
          let {accounts, instance} = await connectWeb3Metamask(provider);
          setAccounts(accounts);
          setContract(instance);
        } else {
          alert(
            `Metamask not found. Install metamask!!`
          )
        }
      } catch (error) {
        // -32002 error code means metamask is trying to take permission
        if(error.code !== -32002){
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
        }
        console.log(error);
      }
    }
    connect();
  },[])

  return (
    <div className="App">
       { contractInstance == null ? 
        <>
          <h2 style={{textAlign: "center"}}> Loading Application </h2>
        </> :
        <>
          <BrowserRouter>
            <Routes>
              <Route index element={<AdminComponent contractInstance={contractInstance} account={accounts[0]} />}/>
              <Route path="/voting" element={<VoterComponent  contractInstance={contractInstance} account={accounts[0]} />} />
            </Routes>
          </BrowserRouter>
        </>}
      
    </div>
  );
}

export default App;
