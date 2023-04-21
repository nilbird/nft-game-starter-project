const CONTRACT_ADDRESS = "0x5Fd48FA81FAAd132d399901D3628A94A1776ea67";

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
