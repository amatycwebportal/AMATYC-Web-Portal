import { ReactNode, useEffect, useState, MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AppTheme from '../theme/AppTheme';
import ColorModeSelect from '../theme/ColorModeSelect';
import { User, UserRole } from '../../../shared/types';
import logo from '../assets/TPSE-logo.png';
import { useFetchUser } from '../utils/hooks/auth/useFetchUser';
import { useLogout } from '../utils/hooks/auth/useLogout';
interface MainLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  requiresAdmin?: boolean;
}

const navItems: NavItem[] = [
  { label: 'My Completed Rubrics', path: '/rubrics/completed' },
  { label: 'Assigned Rubrics', path: '/rubrics/assigned' },
  { label: 'Rubrics in Progress', path: '/rubrics/in-progress' },
  { label: 'Admin', path: '/admin', requiresAdmin: true },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const { executeLogout } = useLogout();
  const [navAnchorEl, setNavAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  
  

  const getAvatarUrl = () => {
    if (!user?.avatarUrl) {
      return '';
    }
    return user.avatarUrl;
  };

  const getUserInitials = () => {
    if (!user?.name) {
      return '';
    }
    const nameParts = user.name.split(' ').filter(Boolean);
    if (nameParts.length === 0) {
      return '';
    }
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const adminRoles: UserRole[] = ["PROJECT_LEAD", "LOCAL_LEADER"];

  const isAdmin = adminRoles.includes((user as User & { role: UserRole })?.role);
  
  const handleLogoClick = () => {
    navigate('/rubrics/assigned');
  };

  const handleNavItemClick = (path: string) => {
    navigate(path);
    setNavAnchorEl(null);
  };

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setNavAnchorEl(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setNavAnchorEl(null);
  };

  const handleOpenProfileMenu = (event: MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setProfileAnchorEl(null);
  };

  const executeGoToProfile = () => {
    navigate('/profile');
    setProfileAnchorEl(null);
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const visibleNavItems = navItems.filter((item) =>
    item.requiresAdmin ? isAdmin : true,
  );

  return (
    <AppTheme>
      <Box
        sx={{
          minHeight: '100dvh',
          bgcolor: 'background.default',
          color: 'text.primary',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppBar
          position="static"
          color="default"
          elevation={1}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                gap: 1.5,
              }}
              onClick={handleLogoClick}
            >
              <Box
                component="img"
                src={logo}
                alt="TPSE Logo"
                sx={{ height: 40, width: 'auto' }}
              />
              {/* Optional: Add TPSE Logo Text */}
              {/* <Typography
                variant="h6"
                noWrap
                sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
              >
                TPSE
              </Typography> */}
            </Box>

            {isMobile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ColorModeSelect size="small" />
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  onClick={handleOpenNavMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={navAnchorEl}
                  open={Boolean(navAnchorEl)}
                  onClose={handleCloseNavMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {visibleNavItems.map((item) => (
                    <MenuItem
                      key={item.path}
                      selected={isActivePath(item.path)}
                      onClick={() => handleNavItemClick(item.path)}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem disabled={isLoadingUser || hasUserError}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Avatar
                        src={getAvatarUrl()}
                        alt={user?.name ?? ''}
                        sx={{ width: 32, height: 32 }}
                      >
                        {getUserInitials()}
                      </Avatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2">
                          {user?.name ?? 'User'}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {user?.email ?? ''}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={executeGoToProfile}>Profile</MenuItem>
                  <MenuItem onClick={executeLogout}>Sign out</MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 3,
                  ml: 3,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    flexWrap: 'wrap',
                  }}
                >
                  {visibleNavItems.map((item) => (
                    <Button
                      key={item.path}
                      color={isActivePath(item.path) ? 'primary' : 'inherit'}
                      variant={isActivePath(item.path) ? 'contained' : 'text'}
                      onClick={() => handleNavItemClick(item.path)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: isActivePath(item.path) ? 600 : 500,
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <ColorModeSelect size="small" />
                  <IconButton
                    onClick={handleOpenProfileMenu}
                    sx={{ p: 0 }}
                    aria-label="Open profile menu"
                  >
                    <Avatar
                      src={getAvatarUrl()}
                      alt={user?.name ?? ''}
                      sx={{ width: 36, height: 36 }}
                    >
                      {getUserInitials()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={handleCloseProfileMenu}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem disabled={isLoadingUser || hasUserError}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        <Avatar
                          src={getAvatarUrl()}
                          alt={user?.name ?? ''}
                          sx={{ width: 32, height: 32 }}
                        >
                          {getUserInitials()}
                        </Avatar>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: 200,
                          }}
                        >
                          <Typography variant="body2" noWrap>
                            {user?.name ?? 'User'}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            {user?.email ?? ''}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={executeGoToProfile}>Profile</MenuItem>
                    <MenuItem onClick={executeLogout}>Sign out</MenuItem>
                  </Menu>
                </Box>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </AppTheme>
  );
}

