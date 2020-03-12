import React, { useContext } from 'react'

import { Link as RouterLink } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import ToolBar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import { AuthContext } from 'HNA/components/AuthContext.jsx'

const HeaderBar = () => {
  const { isAuthed, logout } = useContext(AuthContext)

  return (
    <AppBar style={{ zIndex: '1100' }} position='sticky' >
      <ToolBar style={{ display: 'flex' }}>
        <Typography variant='h4' style={{ flexGrow: 1 }}>
          <Link component={RouterLink} to='/patients' style={{ color: 'black' }}>
            <span>HN APP</span>
          </Link>
        </Typography>
        {isAuthed ? <Button onClick={() => logout()}>Log Out</Button> : null}
      </ToolBar>
    </AppBar>
  )
}

export default HeaderBar
