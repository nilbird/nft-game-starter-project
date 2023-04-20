const CONTRACT_ADDRESS = "0x8aBfb114Cc4F010E8D6bf5cd24CA251a2CB499A9";

// NFTキャラクターの属性をフォーマットしてオブジェクトとして返す。
const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };
