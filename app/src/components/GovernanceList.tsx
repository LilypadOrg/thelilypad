import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import {
  DaoProposalEntity,
  DaoProposalModel,
} from '~/server/entities/DaoProposalEntity';
import { proposalStatesEnum } from '~/types/enums';
import { trpc } from '~/utils/trpc';
import ProposalStatusWidget from './ProposalStatusWidget';

const pageQtty = 10;

const GovernanceList = () => {
  const utils = trpc.useContext();
  var proposalList: DaoProposalModel[] = [{}];
  //const [rowCount, setRowCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentList, setCurrentList] = useState(proposalList);

  useEffect(() => {
    console.log('teste');
    setCurrentList([]);
    utils.invalidateQueries(['dao.list']);
  }, []);

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

  const { isLoading } = trpc.useQuery(
    [
      'dao.list',
      {
        take: pageQtty,
        skip: pageQtty * (currentPage - 1),
      },
    ],
    {
      initialData: [{}],
      onSuccess: (data) => {
        const convertedData = data.map((element) => {
          return DaoProposalEntity.parse(element, element.votes!!);
        });
        setCurrentList(convertedData);
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

  const StatusButtonComponent = (proposal: DaoProposalModel) => {
    let buttonCss = 'btn w-24';
    if (proposal.status == proposalStatesEnum.Defeated)
      buttonCss += ' bg-red-800';
    else if (proposal.status == proposalStatesEnum.Succeeded)
      buttonCss += ' bg-lime-600';
    else if (proposal.status == proposalStatesEnum.Active)
      buttonCss += ' bg-blue-700';
    else if (proposal.status == proposalStatesEnum.Executed)
      buttonCss += ' btn-primary';
    else buttonCss += ' btn-primary';

    buttonCss += ' btn-sm';

    return <button className={buttonCss}>{proposal.statusDesc}</button>;
  };

  const DataComponent = () => {
    const rows: JSX.Element[] = [];
    currentList.forEach((element: DaoProposalModel) => {
      rows.push(
        <tr className="border-2">
          <td>
            <div className="font-bold">
              <Link
                href={{
                  pathname: `/dao/proposal/${element.id}`,
                  query: { proposal: JSON.stringify(element) },
                }}
              >
                <button className="btn btn-primary btn-xs btn-circle">
                  {element.id}
                </button>
              </Link>
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
            <ProposalStatusWidget
              statusId={element.id!!}
              statusDescription={element.statusDesc ?? 'UNKNOWN'}
              width={24}
              size="sm"
              url={`/dao/proposal/${element.id}`}
            />
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
      {isLoading ? (
        <div>
          <div className="flex animate-pulse flex-col py-8">
            <h1 className="mb-2 w-[30%] rounded-md bg-gray-400 text-4xl font-bold text-transparent">
              Loading Proposal...
            </h1>
          </div>
          {/* hero image */}
          <div className="relative flex h-[200px] w-full animate-pulse items-center justify-center rounded-md bg-main-gray-dark sm:h-[300px] md:h-[400px] lg:h-[600px]"></div>
        </div>
      ) : (
        !isLoading && (
          <div>
            <DataComponent />
            <div className="mt-2 flex justify-center">
              <PaginationComponent />
            </div>
          </div>
        )
      )}
    </div>
  );
};

// GovernanceTreasury.displayName = 'GovernanceTreasury';

export default GovernanceList;
