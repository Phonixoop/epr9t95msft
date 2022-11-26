import { useEffect, useState } from "react";

import MultiRowTextBox from "@/ui/forms/multi-row";
import { useRef } from "react";

import withLable from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";

import TextField from "ui/forms/text-field";
import TextAreaField from "ui/forms/textarea-field";
import Button from "ui/buttons";

const TextWithLable = withLable(TextField);
const TextAreaWithLable = withLable(TextAreaField);

export default function AddressFields({ values = [], onChange = () => {} }) {
  const [addresses, setAddresses] = useState(values || []);

  function updateAddresses(value) {
    const updatedAddress = addresses.map((address) => {
      const { title, description } = value;
      if (value.id === address.id) {
        return { ...address, ...{ title, description } };
      }
      return address;
    });
    setAddresses(updatedAddress);
  }

  useEffect(() => {
    onChange(addresses);
  }, [addresses]);

  return (
    <MultiRowTextBox
      values={addresses}
      onChange={setAddresses}
      renderItems={(item, removeRow, addRow) => {
        const { id, title, description } = item;
        return (
          <>
            <AddressGroupTextBox
              key={item.id}
              value={{ id, title, description }}
              onChange={(value) => {
                updateAddresses(value);
              }}
            />
          </>
        );
      }}
    />
  );
}

function AddressGroupTextBox({
  value = { id: 0, name: "", weight: "" },
  focused = false,
  onChange = () => {},
  onKeyUp = () => {},
}) {
  const ref = useRef(undefined);
  return (
    <div className="flex flex-col w-full gap-2">
      <div className=" flex-grow">
        <TextWithLable
          label="نام"
          value={value.title}
          focused={focused}
          onChange={(val) => {
            onChange({ ...value, title: val });
          }}
          onKeyUp={onKeyUp}
        />
      </div>
      <div className="flex-grow">
        <TextAreaWithLable
          label="توضیحات آدرس"
          value={value.description}
          onChange={(val) => {
            onChange({ ...value, description: val });
          }}
          onKeyUp={onKeyUp}
        />
      </div>
    </div>
  );
}
