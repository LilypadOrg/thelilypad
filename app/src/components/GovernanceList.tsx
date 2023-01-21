import React, { useMemo, useState } from 'react';
import { trpc } from '~/utils/trpc';

const pageQtty = 10;

const GovernanceList = () => {
  const utils = trpc.useContext();

  //const [rowCount, setRowCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentList, setCurrentList] = useState<
    {
      status: number | null;
      id: number;
      description: string;
      proposalId: string | null;
      eta: number | null;
      tx: string | null;
      snapshotBlock: string | null;
    }[]
  >([]);

  trpc.useQuery(['dao.count'], {
    onSuccess: (data) => {
      if ((data ?? 0) > 0) {
        //setRowCount(data ?? 0);
        setPageCount(Math.ceil(data / pageQtty));
      } else {
        //setRowCount(data ?? 0);
        setPageCount(3);
      }
    },
    onError: () => {
      console.error('error');
    },
  });

  trpc.useQuery(
    [
      'dao.list',
      {
        take: pageQtty,
        skip: pageQtty * (currentPage - 1),
      },
    ],
    {
      onSuccess: (data) => {
        setCurrentList(data);
      },
      onError: () => {
        console.error('error');
      },
    }
  );

  useMemo(() => {
    utils.invalidateQueries(['dao.list']);
  }, [currentPage]);

  const onPageClick = (pagNum: number) => {
    setCurrentPage(pagNum);
  };

  const PaginationComponent = () => {
    const buttons: JSX.Element[] = [];
    for (let i = 0; i < pageCount; i++) {
      buttons.push(
        <button
          className={
            currentPage == i + 1 ? 'btn btn-active btn-xs' : 'btn btn-xs'
          }
          onClick={() => onPageClick(i + 1)}
        >
          {i + 1}
        </button>
      );
    }
    return (
      <div className="btn-group">
        {buttons.length > 1 ? buttons.map((element) => element) : ''}
      </div>
    );
  };

  const DataComponent = () => {
    const rows: JSX.Element[] = [];
    currentList.forEach((element) => {
      rows.push(
        <tr className="border-2">
          <td>
            <div className="font-bold">
              <button className="btn btn-primary btn-xs btn-circle">
                {element.id}
              </button>
            </div>
          </td>
          <td>
            <div className="flex items-center space-x-3">
              <div>
                <div className="font-bold">{element.description}</div>
              </div>
            </div>
          </td>
          <td></td>
          <td></td>
          <th>
            <button className="btn btn-primary btn-sm">VOTE</button>
          </th>
        </tr>
      );
    });

    return (
      <div className="w-full overflow-x-auto">
        <table className="table-normal w-full">
          <tbody>{rows.length > 0 ? rows.map((element) => element) : ''}</tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <DataComponent />
      <div className="mt-2 flex justify-center">
        <PaginationComponent />
      </div>
    </div>
  );
};

// GovernanceTreasury.displayName = 'GovernanceTreasury';

export default GovernanceList;
