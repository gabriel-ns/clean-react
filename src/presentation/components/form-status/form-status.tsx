import React, { useContext } from 'react'
import Spinner from '@/presentation/components/spinner/spinner'
import Styles from './form-status-styles.scss'
import Context from '@/presentation/components/contexts/form-context'

const FormStatus: React.FC = () => {
  const { isLoading, mainError } = useContext(Context).state
  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      { isLoading && <Spinner className={Styles.spinner} /> }
      { mainError.main && <span className={Styles.error}>{mainError.main}</span>}
    </div>
  )
}

export default FormStatus
