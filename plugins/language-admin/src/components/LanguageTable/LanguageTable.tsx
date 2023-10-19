import React from 'react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { languageAdminTranslationRef } from '../../translation';

export const exampleLanguages = {
  results: [
    {
      name: 'English (US)',
      metadataValue: 'en_US',
      created: new Date('03/22/2022'),
      isDefault: true,
    },
    {
      name: 'German (DE)',
      metadataValue: 'de_DE',
      created: new Date('03/01/2022'),
      isDefault: false,
    },
    {
      name: 'Japanese (JA)',
      metadataValue: 'ja_JP',
      created: new Date(),
      isDefault: false,
    },
  ],
};

type Language = {
  name: string;
  metadataValue: string; // "duane.reed@example.com"
  created: Date;
  isDefault: boolean;
};

type DenseTableProps = {
  languages: Language[];
};

export const DenseTable = ({ languages }: DenseTableProps) => {
  const { t } = useTranslationRef(languageAdminTranslationRef);

  const columns: TableColumn[] = [
    { title: t('Name'), field: 'name' },
    { title: t('Metadata value'), field: 'metadataValue' },
    { title: t('Created'), field: 'created' },
    { title: t('Actions') },
  ];

  const data = languages.map(language => {
    const { isDefault, created, ...rest } = language;
    return {
      ...rest,
      name: isDefault ? (
        <>
          {rest.name} <i>{t('Default')}</i>
        </>
      ) : (
        rest.name
      ),
      created: `${created}`,
    };
  });

  return (
    <Table
      title={t('Languages ({{count}})', { count: 3 } as any)}
      options={{ search: true, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const LanguageTable = () => {
  const { value, loading, error } = useAsync(async (): Promise<User[]> => {
    // Would use fetch in a real world example
    return exampleLanguages.results;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <DenseTable languages={value || []} />;
};
