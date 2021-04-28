import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import "./css/index.scoped.css";

const Suggestion = ({ style, selectContact, contact, selected = false }) => {
  const { name, avatar, type } = contact;
  const renderedAvatar = useMemo(() => {
    if (avatar) {
      return (
        <img
          className="suggestion-avatar suggestion-avatar-img"
          src={avatar}
          alt="Suggestion Avatar"
        />
      );
    }

    if (type === "btc") {
      return (
        <div className="suggestion-avatar">
          <i className="suggestion-icon fab fa-bitcoin" />
        </div>
      );
    }

    if (type === "invoice") {
      return (
        <div className="suggestion-avatar">
          <i className="suggestion-icon fas fa-list-box" />
        </div>
      );
    }

    if (type === "keysend") {
      return (
        <div className="suggestion-avatar">
          <i className="suggestion-icon fas fa-list-box" />
        </div>
      );
    }

    return <div className="suggestion-avatar" />;
  }, [avatar, type]);

  const typeDesc = useMemo(() => {
    if (type === "btc") {
      return "Bitcoin Address";
    }

    if (type === "invoice") {
      return "Lightning Invoice";
    }

    if (type === "keysend") {
      return "Lightning Keysend";
    }

    if (type === "contact") {
      return "Shocknet Contact";
    }

    return "Unknown";
  }, [type]);

  const onClick = useCallback(() => {
    if (selectContact) {
      selectContact(selected ? null : contact);
    }
  }, [selectContact, contact, selected]);

  return (
    <div
      className={classNames({
        suggestion: true,
        "suggestion-selected": selected
      })}
      style={style}
      onClick={onClick}
    >
      <div className="suggestion-info-container">
        {renderedAvatar}
        <div className="suggestion-info">
          <p className="suggestion-name">{name}</p>
          <p className="suggestion-type">{typeDesc}</p>
        </div>
      </div>
      {selected ? (
        <div className="remove-contact-button">
          <i className="fas fa-times"></i>
        </div>
      ) : null}
    </div>
  );
};

export default Suggestion;
