import React, { useContext, InputHTMLAttributes, useRef } from 'react'
import Styles from './input-styles.scss'
import Context from '@/presentation/components/contexts/form-context'

type Props = InputHTMLAttributes<HTMLInputElement>

const Footer: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(Context)
  const inputRef = useRef<HTMLInputElement>()
  const error = state[`${props.name}Error`]

  return (
    <div className={Styles.inputWrap}>
      <input
        {...props}
        ref={ inputRef }
        placeholder=" "
        data-testid={props.name}
        readOnly
        onFocus={ e => { e.target.readOnly = false } }
        onChange={e => { setState({ ...state, [e.target.name]: e.target.value }) }}
      />
      <label onClick={() => { inputRef.current.focus() }}>
        { props.placeholder }
      </label>
      <span
      data-testid={`${props.name}-status`}
      title={ error || 'Tudo certo!' }
      className={ Styles.status }>
        { error ? '🔴' : '🟢' }
      </span>
    </div>
  )
}

export default Footer
