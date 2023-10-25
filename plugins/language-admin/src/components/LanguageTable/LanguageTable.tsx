import React, { useState } from 'react';
import {
  Table,
  TableColumn,
  ResponseErrorPanel,
  LinkButton,
} from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { languageAdminTranslationRef } from '../../translation';
import {
  Language,
  ListLanguagesOptions,
  languageStorageApiRef,
} from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';

export const LanguageTable = () => {
  const [error, setError] = useState<Error>();
  const { t } = useTranslationRef(languageAdminTranslationRef);
  const languageStorage = useApi(languageStorageApiRef);

  const renderActionCell = ({}) => {
    return (
      <>
        <LinkButton to={''} variant="text">
          <ModeEditIcon />
        </LinkButton>
        <LinkButton to={''} variant="text">
          <DeleteIcon />
        </LinkButton>
      </>
    );
  };

  const columns: TableColumn<Language>[] = [
    {
      title: t('Name'),
      field: 'name',
      render: ({ name, isDefault }) =>
        isDefault ? (
          <>
            {' '}
            {name} <i>{t('Default')}</i>
          </>
        ) : (
          name
        ),
      width: '30%',
    },
    { title: t('Language Code'), field: 'languageCode', width: '20%' },
    {
      title: t('Created'),
      field: 'createdAt',
      type: 'date',
      width: '25%',
    },
    {
      align: 'right',
      title: t('Actions'),
      render: renderActionCell,
      width: '20%',
    },
  ];

  const fetchData = async (query: any) => {
    try {
      const result = await languageStorage.listLanguages({
        ...(query?.orderBy
          ? {
              orderBy: {
                field: query.orderBy.field,
                direction: query.orderDirection,
              } as ListLanguagesOptions['orderBy'],
            }
          : {}),
        filters: query?.filters?.map((filter: any) => ({
          field: filter.column.field!,
          value: `*${filter.value}*`,
        })) as ListLanguagesOptions['filters'],
      });
      return {
        data: result.items,
        totalCount: result.totalCount,
        page: 0,
      };
    } catch (loadingError) {
      setError(loadingError as Error);
      return { data: [], totalCount: 0, page: 0 };
    }
  };

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }
  return (
    <Table
      title={t('Languages')}
      options={{
        sorting: true,
        paging: false,
        debounceInterval: 500,
      }}
      columns={columns}
      data={fetchData}
    />
  );
};
