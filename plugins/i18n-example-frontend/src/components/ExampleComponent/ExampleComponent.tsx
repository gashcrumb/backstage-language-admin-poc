import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { ExampleFetchComponent } from '../ExampleFetchComponent';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { i18nExampleFrontendTranslationRef } from '../../translation';

export const ExampleComponent = () => {
  const { t } = useTranslationRef(i18nExampleFrontendTranslationRef);
  return (
    <Page themeId="tool">
      <Header
        title={t('Welcome to {{appName}}', { appName: 'i18n example frontend' } as any)}
        subtitle={t("Optional subtitle")}
      >
        <HeaderLabel label={t('Owner')} value="Team X" />
        <HeaderLabel label={t('Lifecycle')} value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title={t("Plugin title")}>
          <SupportButton>
            {t('A description of your plugin goes here.')}
          </SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title={t("Information card")}>
              <Typography variant="body1">
                {t('All content should be wrapped in a card like this.')}
              </Typography>
            </InfoCard>
          </Grid>
          <Grid item>
            <ExampleFetchComponent />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
