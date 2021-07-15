import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthMethod, setAuthStep } from "../../../../actions/AuthActions";
import { createWallet } from "../../../../actions/NodeActions";
import Loader from "../../../../common/Loader";
import * as Store from "../../../../store";

const CreateWalletStep = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      case "confirmPassword": {
        setConfirmPassword(value);
        return;
      }
      default:
        return;
    }
  }, [setAlias,setPassword,setConfirmPassword]);

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();

      if (alias.length < 3 || alias.length > 32) {
        setError("Please specify an alias that is 3-32 characters long");
        return;
      }

      if (password !== confirmPassword) {
        setError("Password and Confirm password fields must match");
        return;
      }

      if (password.length < 8 || password.length > 32) {
        setError("Password length should be 8-32 characters long");
        return;
      }

      try {
        setLoading(true);
        const wallet = await dispatch(createWallet({ alias, password }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [alias, password, confirmPassword, dispatch]
  );

  const chooseAnotherMethod = useCallback(() => {
    dispatch(setAuthMethod(null));
    dispatch(setAuthStep(null));
  }, [dispatch]);

  return (
    <div className="auth-form-container">
      {loading ? (
        <Loader overlay fullScreen text="Creating New Wallet..." />
      ) : null}
      <p className="auth-form-container-title">Create New Wallet</p>
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="alias"
          placeholder="Wallet Alias"
          value={alias}
          onChange={onInputChange}
          className="input-field"
          autoCorrect="off"
          autoCapitalize="none"
        />
        <input
          type="password"
          name="password"
          placeholder="Wallet Password"
          value={password}
          onChange={onInputChange}
          className="input-field"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Wallet Password"
          value={confirmPassword}
          onChange={onInputChange}
          className="input-field"
        />
        {error ? <p className="error-container">{error}</p> : null}
        <button className="submit-btn">Create</button>
        <p className="inline-link" onClick={chooseAnotherMethod}>
          Choose another method
        </p>
      </form>
    </div>
  );
};

export default CreateWalletStep;
