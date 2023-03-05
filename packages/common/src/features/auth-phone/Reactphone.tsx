import React from "react";

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
// @ts-ignore
import ru from 'react-phone-number-input/locale/ru'
import '../../../../tracker/src/App.less'

type Props = {
  value:string
  setValue:(value:string) => void
};

export const Reactphone = (props: Props) => {
  // `value` will be the parsed phone number in E.164 format.
  // Example: "+12133734253".
  const {value, setValue} = props
  const onchange = (value:string) => { setValue(value) }
  return (
    <div>
      <PhoneInput
        className="phone"
        labels={ru}
        placeholder="Ваш телефон"
        value={value}
        onChange={onchange} />
    </div>
  )
}