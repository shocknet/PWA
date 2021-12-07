import React, { Suspense, memo, useCallback, useMemo } from "react";
import { resetPaymentResponse } from "../../actions/GuestActions";
import { useSelector } from "../../store";
import Loader from "../Loader";
import "./css/index.scoped.css";
import { useDispatch } from "react-redux";

const TipModalContent = React.lazy(() => import("./components/Modal"));

const GuestTipModal = (props: {
  toggleOpen: (data?: any) => void;
  tipData: any;
  publicKey: string;
}) => {
  const { toggleOpen, tipData } = props;
  const dispatch = useDispatch();
  const authenticated = useSelector(({ auth }) => auth.authenticated);

  const loader = useMemo(
    () => <Loader text="Loading..." style={{ margin: "40px 0" }} />,
    []
  );

  const close = useCallback(() => {
    dispatch(resetPaymentResponse());
    toggleOpen();
  }, [dispatch, toggleOpen]);

  if (!tipData || authenticated) {
    return null;
  }

  return (
    <div className="modal-container">
      <div className="modal-overlay" onClick={close}></div>
      <div className="modal-content">
        <Suspense fallback={loader}>
          <TipModalContent {...props} />
        </Suspense>
      </div>
    </div>
  );
};

export default memo(GuestTipModal);
