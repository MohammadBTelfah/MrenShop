import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

import { createTheme } from '@mui/material/styles';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import InventoryIcon from '@mui/icons-material/Inventory';

import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';

import Profile from './profile';
import Products from './products';

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname, profileData }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {pathname === "/Profile" && <Profile profileData={profileData} />}
      {pathname === "/dashboard" && (
        <Typography variant="h4" gutterBottom>
          Page Dashboard
        </Typography>
      )}
      {pathname === "/products" && (
        <Typography variant="h4" gutterBottom>
          <Products />
        </Typography>
      )}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
  profileData: PropTypes.object,
};

function ToolbarActionsSearch() {
  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{ display: { xs: 'inline', md: 'none' } }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{ display: { xs: 'none', md: 'inline-block' }, mr: 1 }}
      />
      <ThemeSwitcher />
    </Stack>
  );
}

function SidebarFooter({ mini }) {
  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
    >
      {mini ? '© MUI' : `© ${new Date().getFullYear()} Made with love by MUI`}
    </Typography>
  );
}

SidebarFooter.propTypes = {
  mini: PropTypes.bool.isRequired,
};

function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <CloudCircleIcon fontSize="large" color="primary" />
      <Typography variant="h6">My App</Typography>
      <Chip size="small" label="BETA" color="info" />
      <Tooltip title="Connected to production">
        <CheckCircleIcon color="success" fontSize="small" />
      </Tooltip>
    </Stack>
  );
}

function DashboardLayoutSlots(props) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // optional
    navigate('/login');
  };

  const NAVIGATION = [
    { kind: 'header', title: 'Main items' },
    { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
    { segment: 'orders', title: 'Orders', icon: <ShoppingCartIcon /> },
    { segment: 'Profile', title: 'Profile', icon: <AccountBoxIcon /> },
    ...(isAdmin
      ? [{ segment: 'products', title: 'Products', icon: <InventoryIcon /> }]
      : []),
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      async function fetchData() {
        try {
          const res = await axios.get("http://127.0.0.1:5003/api/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Role from API:", res.data.role);
          setIsAdmin(res.data.role === 'admin');
          setProfileData(res.data);
        } catch (error) {
          console.error("Error fetching profile data:", error);
          navigate('/login');
        }
      }
      fetchData();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const { window } = props;
  const router = useDemoRouter('/dashboard');
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout
          slots={{
            appTitle: CustomAppTitle,
            toolbarActions: ToolbarActionsSearch,
            sidebarFooter: SidebarFooter,
          }}
        >
          {profileData.role ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                px: 3,
                py: 1,
              }}
            >
              <Typography>
                Welcome, your role is: <strong>{profileData.role}</strong>
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}

          <DemoPageContent profileData={profileData} pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}

DashboardLayoutSlots.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutSlots;
