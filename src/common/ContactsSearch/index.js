import React, { useCallback, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useOutsideClick from "use-onclickoutside";
import { processDisplayName } from "../../utils/String";
import Suggestion from "./components/Suggestion";
import "./css/index.scoped.css";

const ContactsSearch = ({
  features = ["btc", "invoice", "contact"],
  selectContact = () => {}
}) => {
  const ref = useRef();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const contacts = useSelector(({ chat }) => chat.contacts);

  const isBTCAddress = useMemo(
    () =>
      /^(bc(1|r)|[123]|m|n|((t|x)pub)|(tb1))[a-zA-HJ-NP-Z0-9]{25,90}$/.test(
        value
      ),
    [value]
  );

  const isLightningInvoice = useMemo(
    () => /^(ln(tb|bc|bcrt))[0-9][a-z0-9]{180,7089}$/.test(value.toLowerCase()),
    [value]
  );

  const isLnPubKey = useMemo(() => /^[a-f0-9]{66}$/.test(value.toLowerCase()), [
    value
  ]);

  const filterContacts = useCallback(() => {
    const filteredContacts = contacts.filter(contact => {
      const name = processDisplayName(contact?.pk, contact?.displayName);
      console.log("Name:", name, value);
      if (!name) {
        return false;
      }

      if (!name.toLowerCase().includes(value.toLowerCase())) {
        return false;
      }

      return true;
    });

    return filteredContacts.map(contact => ({
      ...contact,
      name: processDisplayName(contact.pk, contact.displayName),
      type: "contact"
    }));
  }, [value, contacts]);

  const suggestions = useMemo(() => {
    const filteredContacts = features.includes("contact")
      ? filterContacts()
      : [];

    if (features.includes("btc") && isBTCAddress) {
      return [
        { address: value, name: value, type: "btc" },
        ...filteredContacts
      ];
    }

    if (features.includes("invoice") && isLightningInvoice) {
      return [
        { paymentRequest: value, name: value, type: "invoice" },
        ...filteredContacts
      ];
    }

    if (features.includes("keysend") && isLnPubKey) {
      return [
        { dest: value, name: value, type: "keysend" },
        ...filteredContacts
      ];
    }

    return filteredContacts;
  }, [
    features,
    isBTCAddress,
    isLightningInvoice,
    isLnPubKey,
    value,
    filterContacts
  ]);

  console.log(suggestions);

  const onChange = useCallback(e => {
    if (e.target.name === "search") {
      setValue(e.target.value);
    }
  }, []);

  const onFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const onBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const onSuggestionClick = useCallback(
    contact => {
      selectContact(contact);
      setFocused(false);
    },
    [selectContact]
  );

  useOutsideClick(ref, onBlur);

  return (
    <div className="contacts-search" ref={ref} tabIndex="0" onFocus={onFocus}>
      <div className="contacts-search-input-container">
        <i className="contacts-search-icon fas fa-search" />
        <input
          type="text"
          className="contacts-search-input"
          name="search"
          onChange={onChange}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>
      {focused && suggestions.length ? (
        <div className="contacts-search-suggestions">
          {suggestions.map(suggestion => (
            <Suggestion
              selectContact={onSuggestionClick}
              contact={suggestion}
              key={suggestion.pk ?? suggestion.value}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ContactsSearch;
