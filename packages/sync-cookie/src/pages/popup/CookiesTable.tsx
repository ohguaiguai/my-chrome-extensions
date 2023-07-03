import React from "react";

interface ICookiesTableProps {
  cookies: chrome.cookies.Cookie[];
}

export const CookiesTable = (props: ICookiesTableProps) => {
  const { cookies } = props;
  return (
    <table>
      <tr>
        <th>name</th>
        <th>value</th>
        <th>path</th>
      </tr>
      <tbody>
        {cookies.map((cookie) => (
          <tr>
            <td>{cookie.name}</td>
            <td>{cookie.value}</td>
            <td>{cookie.path}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
