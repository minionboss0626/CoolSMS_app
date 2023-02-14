// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Actions Imports
import { fetchData } from 'src/store/apps/message'

// ** Custom Table Components Imports
import TableHeader from 'src/views/dashboard/message/list/TableHeader'

const RowOptions = ({ id }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href={`/messages/view/${id}`}
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.15,
    minWidth: 150,
    field: 'receiver',
    headerName: 'Phone Number',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.receiver}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: 'sender',
    headerName: 'Sender',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.sender}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: 'message',
    headerName: 'Message',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.message}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 80,
    field: 'isRead',
    headerName: 'IsRead',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.isRead ? 'Yes' : 'No'}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 80,
    field: 'deleted',
    headerName: 'Deleted',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.deleted ? 'Yes' : 'No'}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 220,
    field: 'createdAt',
    headerName: 'Created At',
    renderCell: ({ row }) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).format(row.createdAt * 1000)}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 220,
    field: 'updatedAt',
    headerName: 'Updated At',
    renderCell: ({ row }) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).format(row.updatedAt * 1000)}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions id={row.id} />
  }
]

const MessagesPage = () => {
  // ** State
  const [value, setValue] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [addLineOpen, setAddLineOpen] = useState(false)

  // ** Hooks
  const dispatch = useDispatch()
  const { data } = useSelector(state => state.message)
  useEffect(() => {
    dispatch(
      fetchData({
        q: value
      })
    )
  }, [dispatch, value])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])
  const toggleAddLineDrawer = () => setAddLineOpen(!addLineOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='My Messages' />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddLineDrawer} />
          <DataGrid
            autoHeight
            rows={data}
            columns={columns}
            checkboxSelection
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

MessagesPage.acl = {
  action: 'read',
  subject: 'user-page'
}

export default MessagesPage
