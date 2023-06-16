import React from 'react';
import { Table } from 'antd';

interface ICookiesTableProps {
  cookies: chrome.cookies.Cookie[];
}

export const CookiesTable = (props: ICookiesTableProps) => {
  const { cookies } = props;

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value'
    },
    {
      title: 'domain',
      dataIndex: 'domain',
      key: 'domain'
    }
  ];

  return (
    <Table style={{ width: '100%' }} dataSource={cookies} columns={columns} />
  );
};
