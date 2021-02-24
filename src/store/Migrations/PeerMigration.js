const PeerMigration = state => {
  console.log("--- PeerMigration Started ---");
  const newState = {
    ...state,
    wallet: {
      ...state.wallet,
      peers: []
    }
  };
  console.log("--- PeerMigration Ended ---", newState);
  return newState;
};

export default PeerMigration;
