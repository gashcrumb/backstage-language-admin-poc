import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ExtensionIcon from '@material-ui/icons/Extension';
import MapIcon from '@material-ui/icons/MyLocation';
import Language from '@material-ui/icons/Language';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarScrollWrapper,
  SidebarSpace,
  useSidebarOpenState,
  Link,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { appTranslationRef } from '../../translation';
import { IconComponent } from '@backstage/core-plugin-api';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => {
  const { t } = useTranslationRef(appTranslationRef);
  return (
    <SidebarPage>
      <Sidebar>
        <SidebarLogo />
        <SidebarGroup label={t('Search')} icon={<SearchIcon />} to="/search">
          <SidebarSearchModal />
        </SidebarGroup>
        <SidebarDivider />
        <SidebarGroup label={t('Menu')} icon={<MenuIcon />}>
          {/* Global nav, not org-specific */}
          <SidebarItem icon={HomeIcon} to="catalog" text={t('Home')} />
          <SidebarItem
            icon={Language}
            to="i18n-example-frontend"
            text={t('Language')}
          />
          <SidebarItem icon={ExtensionIcon} to="api-docs" text={t('APIs')} />
          <SidebarItem icon={LibraryBooks} to="docs" text={t('Docs')} />
          <SidebarItem
            icon={CreateComponentIcon}
            to="create"
            text={t('Create...')}
          />
          {/* End global nav */}
          <SidebarDivider />
          <SidebarScrollWrapper>
            <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
          </SidebarScrollWrapper>
        </SidebarGroup>
        <SidebarSpace />
        <SidebarDivider />
        <SidebarItem
          icon={AdminPanelSettingsOutlinedIcon as IconComponent}
          to="language-admin"
          text={t('Administration')}
        />
        <SidebarGroup
          label="Settings"
          icon={<UserSettingsSignInAvatar />}
          to="/settings"
        >
          <SidebarSettings />
        </SidebarGroup>
      </Sidebar>
      {children}
    </SidebarPage>
  );
};
