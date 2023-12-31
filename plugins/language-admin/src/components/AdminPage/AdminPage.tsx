import React from 'react';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
  LinkButton,
  TabbedLayout,
} from '@backstage/core-components';
import { LanguageTable } from '../LanguageTable';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { languageAdminTranslationRef } from '../../translation';
import { addLanguageRouteRef } from '../../routes';
import { useRouteRef } from '@backstage/core-plugin-api';

export const AdminPage = () => {
  const addLanguageLink = useRouteRef(addLanguageRouteRef);
  const { t } = useTranslationRef(languageAdminTranslationRef);
  return (
    <Page themeId="tool">
      <Header title={t('Administration')} />
      <TabbedLayout>
        <TabbedLayout.Route path="/permissions" title={t('Permissions')}>
          <></>
        </TabbedLayout.Route>
        <TabbedLayout.Route path="/plugins" title={t('Plugins')}>
          <></>
        </TabbedLayout.Route>
        <TabbedLayout.Route path="/gpts" title={t('Golden Paths')}>
          <></>
        </TabbedLayout.Route>
        <TabbedLayout.Route path="/" title={t('Languages')}>
          <Content>
            <ContentHeader title={'' /* do not remove */}>
              <LinkButton
                to={addLanguageLink()}
                color="primary"
                variant="contained"
              >
                {t('Add')}
              </LinkButton>
              <SupportButton title={t('Support')}>
                A description of your plugin goes here.
              </SupportButton>
            </ContentHeader>
            <LanguageTable />
          </Content>
        </TabbedLayout.Route>
      </TabbedLayout>
    </Page>
  );
};
