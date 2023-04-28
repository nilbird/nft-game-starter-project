import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";
import "./SelectCharacter.css";
import LoadingIndicator from "../LoadingIndicator";

const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  const [mintingCharacter, setMintingCharacter] = useState(false);

  // NFTキャラクターをMintします。
  const mintCharacterNFTAction = (characterId) => async () => {
    try {
      if (gameContract) {
        setMintingCharacter(true);

        console.log("Minting character in progress...");
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);

        setMintingCharacter(false);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);

      setMintingCharacter(false);
    }
  };

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
      // gameContractの状態を更新します。
      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    // NFTキャラクターのデータをスマートコントラクトから取得する。
    const getCharacters = async () => {
      try {
        console.log("Gettingt contract characters to mint");
        // ミント可能な全NFTキャラクターをコントラクトから呼び出します。
        const charactersTxn = await gameContract.getAllDefaultCharacters();

        console.log("charactersTxn:", charactersTxn);

        // すべてのNFTキャラクターのデータを変換します
        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );

        // ミント可能なすべてのNFTキャラクターの状態を設定する。
        setCharacters(characters);
      } catch (error) {
        console.error("Something went wrong fetching characters:", error);
      }
    };

    // イベントを受信したときに起動するコールバックメソッド
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokeId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("CharacterNFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };

    if (gameContract) {
      getCharacters();
      // リスナーの設定
      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      // コンポーネントがアンマウントされたら、リスナーを停止する
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  }, [gameContract]);

  const renderCharacters = () =>
    characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img
          src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`}
          alt={character.name}
        />
        <button
          type="button"
          className="character-mint-button"
          onClick={mintCharacterNFTAction(index)}
        >
          {`Mint ${character.name}`}
        </button>
      </div>
    ));

  return (
    <div className="select-character-container">
      <h2>⏬ 一緒に戦う NFT キャラクターを選択 ⏬</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}

      {mintingCharacter && (
        <div className="loading">
          <div className="indicator">
            <LoadingIndicator />
            <p>Minting In Progress...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectCharacter;
