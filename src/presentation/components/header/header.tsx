import React, { memo } from 'react'
import Logo from '../logo/logo'
import Styles from './header.scss'

const Header: React.FC = () => {
  return (
    <header className={ Styles.headerWrap }>
    <div className={ Styles.headerContent }>
      <Logo />
      <div className={Styles.logoutWrap}>
        <span>Username</span>
        <a href='#'>Logout</a>
      </div>
    </div>
  </header>
  )
}

export default memo(Header)
