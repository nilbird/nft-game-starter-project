import React, { useEffect, useState, useSyncExternalStore } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import myEpicGame from "./utils/MyEpicGame.json";
import SelectCharacter from "./Components/SelectCharacter";
import Arena from "./Components/Arena";
import LoadingIndicator from "./Components/LoadingIndicator";

// Constants
const TWITTER_HANDLE = "あなたのTwitterハンドル";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestNFT, setRequestNFT] = useState(false);

  // ユーザーがSepolia Networkに接続されているか確認する
  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== "11155111") {
        alert("Sepolia Test Network に接続してください");
      } else {
        console.log("Sepolia に接続されています");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MataMask!");
        setIsLoading(false);
        console.log("set isLoading false");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });

        console.log("got accounts");

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account", account);
          setCurrentAccount(account);
          checkNetwork();
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
    console.log("set isLoading false");
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    // シナリオ１
    // ユーザーがWEBアプリにログインしていない場合。
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img src="https://i.imgur.com/TXBQ4cC.png" alt="LUFFY" />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Start
          </button>
        </div>
      );

      // シナリオ２
      // ユーザーがWEBアプリにログインしており、かつNFTキャラクターを持っていないか次のNFTキャラ生成の要請がある場合
    } else if (!characterNFT || requestNFT) {
      return (
        <SelectCharacter
          setCharacterNFT={setCharacterNFT}
          setRequestNFT={setRequestNFT}
        />
      );

      // シナリオ３
      // ユーザーがWEBアプリにログインしており、かつNFTキャラクターを持っている場合
    } else {
      return (
        <Arena
          characterNFT={characterNFT}
          setCharacterNFT={setCharacterNFT}
          setRequestNFT={setRequestNFT}
        />
      );
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      // ユーザーがウォレットを持っているか確認する
      checkIfWalletIsConnected();

      console.log("request account");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // ユーザーがSepoliaに接続されているか確認する。
      checkNetwork();
    } catch (error) {
      console.log(error);
    }
  };

  // ページがロードされたときに useEffect()内の関数が呼び出される
  useEffect(() => {
    setIsLoading(true);
    console.log("set isLoading true");

    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchNFTMetaData = async () => {
      console.log("Checking for Character NFT on adress:", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("No character NFT found");
      }

      // ユーザーが保持しているNFTの確認が完了したら、ロード状態をfalseに設定
      setIsLoading(false);
      console.log("set isLoading false");
    };

    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetaData();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚡️ METAVERSE GAME ⚡️</p>
          <p className="sub-text">プレイヤーと協力してボスを倒そう✨</p>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
