import {
  Content,
  Header,
  InfoCard,
  LinkButton,
  Page,
} from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import { languageAdminTranslationRef } from '../../translation';
import { Button, Typography } from '@material-ui/core';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { languageStorageApiRef } from '../../api';
import { rootRouteRef } from '../../routes';
import TextField from '@mui/material/TextField';
import Autocomplete, {
  AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import * as tags from 'language-tags';

type LanguageOption = {
  code: string;
  label: string;
};

type LanguageFile = {
  languageCode: string;
  translation: Record<string, Record<string, string>>;
};

export const AddLanguagePage = () => {
  const { t } = useTranslationRef(languageAdminTranslationRef);
  const languageStorage = useApi(languageStorageApiRef);
  const adminPageLink = useRouteRef(rootRouteRef);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [languageCode, setLanguageCode] = useState<string | undefined>(
    undefined,
  );
  const [stagedJSON, setStagedJSON] = useState<LanguageFile | undefined>(
    undefined,
  );

  const languages: LanguageOption[] = [];
  console.log('Language code: ', languageCode);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current!.click();
  }, [fileInputRef]);

  const handleFileUploadChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files![0];
      const reader = new FileReader();
      reader.onload = event => {
        const languageFileContents = event.target!.result as string;
        try {
          const languageFile = JSON.parse(languageFileContents);
          const { languageCode } = languageFile;
          if (!tags.check(languageCode)) {
            console.log('Unknown language code: ', languageCode);
            return;
          }
          setLanguageCode(languageFile.languageCode);
          setStagedJSON(languageFile);
        } catch (error) {
          console.log('Caught error parsing JSON: ', error);
        }
      };
      reader.readAsText(file);
    },
    [fileInputRef, languageCode, stagedJSON],
  );
  return (
    <Page themeId="tool">
      <Header title={t('Add a language')} />
      <Content>
        <Grid container>
          <Grid item xs={5}>
            <InfoCard
              title={t('Add a new language')}
              titleTypographyProps={{ component: 'h2' }}
            >
              <Typography paragraph>
                {t(
                  'Browser settings determine the initial language. This choice can be modified at any time through the available languages.',
                )}
              </Typography>
              <Stack spacing={4}>
                {stagedJSON === undefined && (
                  <Stack spacing={2} direction="row">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUploadChange}
                      accept="application/json"
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleUploadClick}
                    >
                      {t('Upload JSON file')}
                    </Button>
                    <LinkButton
                      onClick={() =>
                        languageStorage.downloadLanguage({ code: 'en' })
                      }
                      to={''}
                      variant="text"
                      color="primary"
                    >
                      {t('Download a template')}
                    </LinkButton>
                  </Stack>
                )}
                {stagedJSON !== undefined && (
                  <Stack spacing={4}>
                    Uploading{' '}
                    <LinkButton
                      to={''}
                      color="primary"
                      variant="text"
                      onClick={() => setStagedJSON(undefined)}
                    >
                      {t('Replace')}
                    </LinkButton>
                  </Stack>
                )}
                <Autocomplete
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  renderInput={function (
                    params: AutocompleteRenderInputParams,
                  ): React.ReactNode {
                    return (
                      <TextField
                        {...params}
                        label={t('Type or select a language')}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password',
                        }}
                      />
                    );
                  }}
                  getOptionLabel={(option: LanguageOption) => option.label}
                  renderOption={(props, option) => (
                    <Box {...props} component="li">
                      {option.label}&nbsp;&nbsp;<i>{option.code}</i>
                    </Box>
                  )}
                  options={languages}
                />
                <Stack spacing={2} direction="row">
                  <Button color="primary" variant="contained">
                    {t('Add')}
                  </Button>
                  <LinkButton to={adminPageLink()} color="primary">
                    {t('Cancel')}
                  </LinkButton>
                </Stack>
              </Stack>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
