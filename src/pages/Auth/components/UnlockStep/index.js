import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import Loader from "../../../../common/Loader";
import { unlockWallet } from "../../../../actions/NodeActions";

const UnlockStep = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onInputChange = useCallback(e => {
    const { value, name } = e.target;
    switch (name) {
      case "alias": {
        setAlias(value);
        return;
      }
      case "password": {
        setPassword(value);
        return;
      }
      default:
        return;
    }
  }, []);

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      try {
        const wallet = await dispatch(unlockWallet({ alias, password }));
        console.log("Wallet Response:", wallet);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [alias, password, dispatch, setError]
  );

  return (
    <div className="auth-form-container">
      {loading ? (
        <Loader overlay fullScreen text="Unlocking Wallet..." />
      ) : null}
      <p className="auth-form-container-title">Unlock Wallet</p>
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="alias"
          placeholder="Wallet Alias"
          value={alias}
          onChange={onInputChange}
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Wallet Password"
          value={password}
          onChange={onInputChange}
          className="input-field"
        />
        {error ? <p className="error-container">{error}</p> : null}
        <button className="submit-btn">Unlock</button>
      </form>
    </div>
  );
};

export default UnlockStep;
