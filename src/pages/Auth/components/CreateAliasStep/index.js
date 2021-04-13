import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthMethod, setAuthStep } from "../../../../actions/AuthActions";
import { createAlias, createWallet } from "../../../../actions/NodeActions";
import Loader from "../../../../common/Loader";

const CreateAliasStep = () => {
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

      if (alias.length < 3 || alias.length > 32) {
        setError("Please specify an alias that is 3-32 characters long");
        return;
      }

      try {
        setLoading(true);
        const wallet = await dispatch(createAlias({ alias, password }));
        console.log("Wallet Response:", wallet);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [alias, password, dispatch]
  );

  const chooseUnlockWallet = useCallback(() => {
    dispatch(setAuthStep("unlockWallet"));
  }, [dispatch]);

  const chooseAnotherMethod = useCallback(() => {
    dispatch(setAuthMethod(null));
    dispatch(setAuthStep(null));
  }, [dispatch]);

  return (
    <div className="auth-form-container">
      {loading ? (
        <Loader overlay fullScreen text="Creating New Wallet..." />
      ) : null}
      <p className="auth-form-container-title">Create New Alias</p>
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="alias"
          placeholder="New Alias"
          value={alias}
          onChange={onInputChange}
          className="input-field"
          autoCorrect="off"
          autoCapitalize="none"
        />
        <input
          type="password"
          name="password"
          placeholder="LND Wallet Password"
          value={password}
          onChange={onInputChange}
          className="input-field"
        />
        {error ? <p className="error-container">{error}</p> : null}
        <button className="submit-btn">Create</button>
        <p className="inline-link" onClick={chooseUnlockWallet}>
          Use existing alias
        </p>
        <p className="inline-link" onClick={chooseAnotherMethod}>
          Choose another method
        </p>
      </form>
    </div>
  );
};

export default CreateAliasStep;