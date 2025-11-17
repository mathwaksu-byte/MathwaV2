import { Menu, MenuItemLink } from 'react-admin';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ImageIcon from '@mui/icons-material/Image';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export default function MyMenu() {
  return (
    <Menu>
      <MenuItemLink to="/" primaryText="Dashboard" leftIcon={<SchoolIcon />} />
      <MenuItemLink to="/universities" primaryText="Universities" leftIcon={<SchoolIcon />} />
      <MenuItemLink to="/applications" primaryText="Applications" leftIcon={<SchoolIcon />} />
      <MenuItemLink to="/testimonials" primaryText="Testimonials" leftIcon={<SchoolIcon />} />
      <MenuItemLink to="/faqs" primaryText="Faqs" leftIcon={<SchoolIcon />} />
      <MenuItemLink to="/blogs" primaryText="Blogs" leftIcon={<SchoolIcon />} />
      <MenuItemLink to="/settings" primaryText="Site Settings" leftIcon={<SettingsIcon />} />
      <MenuItemLink to="/settings-media" primaryText="Hero Media" leftIcon={<SettingsIcon />} />
      <MenuItemLink to="/fees" primaryText="University Fees" leftIcon={<MonetizationOnIcon />} />
      <MenuItemLink to="/gallery" primaryText="University Gallery" leftIcon={<PhotoLibraryIcon />} />
      <MenuItemLink to="/dp" primaryText="University DP" leftIcon={<ImageIcon />} />
    </Menu>
  );
}
