const CONTRACT_ADDRESS = "0x6bc8a43dc00e003dfc6cea83a2bd1395ed60d945";

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
