import { NextPage } from 'next';
import { useRouter } from 'next/router';
import ProposalStatusWidget from '~/components/ProposalStatusWidget';
import BackButton from '~/components/ui/BackButton';
import {
  DaoProposalEntity,
  DaoProposalModel,
} from '~/server/entities/DaoProposalEntity';
import { trpc } from '~/utils/trpc';

export type ProposalHeaderProps = {
  propId: number;
  status?: { id: number; description: string };
  proposer: string;
  proposerUrl: string;
  title: string;
  tx?: string;
  txUrl?: string;
};

const ProposalPage: NextPage = () => {
  const id = Number(useRouter().query.id);

  const { data: proposal, isLoading } = trpc.useQuery(['dao.byId', { id }]);
  const daoEntity = DaoProposalEntity.parse(proposal);
  console.log(daoEntity);
  const ProposalHeader = ({
    propId,
    status,
    proposer,
    proposerUrl,
    title,
    tx,
    txUrl,
  }: ProposalHeaderProps): JSX.Element => {
    return (
      <div className="overflow-x-auto">
        <table className="table-compact table w-full">
          <tr>
            <td
              className="justify-start justify-items-start gap-1"
              style={{
                paddingTop: '1px',
                width: '5%',
              }}
            >
              <BackButton
                text="←"
                circle={false}
                outlined={true}
                size="sm"
                url="/dao"
              />
            </td>
            <td
              className="justify-start justify-items-start gap-1"
              style={{
                paddingTop: '1px',
              }}
            >
              <h1 className="mb-2 text-3xl font-bold text-stone-400">
                Proposal {daoEntity.id} {' '}
                <ProposalStatusWidget
                  statusId={daoEntity.status!!}
                  statusDescription={daoEntity.statusDesc ?? 'UNKNOWN'}
                  width={24}
                  size="sm"
                />
              </h1>
            </td>
          </tr>
          <tr>
            <td
              className="justify-start justify-items-start gap-1"
              style={{
                paddingTop: '1px',
                width: '5%',
              }}
            ></td>
            <td
              className="justify-start justify-items-start gap-1"
              style={{
                paddingTop: '1px',
              }}
            >
              <h1 className="mb-2 text-4xl font-bold text-primary">{title}</h1>
            </td>
          </tr>
          <tr>
            <td
              className="justify-start justify-items-start gap-1"
              style={{
                paddingTop: '1px',
                width: '5%',
              }}
            ></td>
            <td
              className="justify-start justify-items-start gap-1"
              style={{
                paddingTop: '1px',
              }}
            >
              <h1 className="mb-1 text-2xl font-bold text-stone-400">
                Proposed by{' '}
                <a
                  className="link-primary link"
                  href={proposerUrl}
                  target="_blank"
                >
                  {proposer ? proposer.substring(0, 5) : ''}..
                  {proposer ? proposer.substring(proposer.length - 5) : ''}
                </a>{' '}
                at{' '}
                <a className="link-primary link" href={txUrl} target="_blank">
                  {tx ? tx.substring(0, 5) : ''}..
                  {tx ? tx.substring(tx.length - 5) : ''}
                </a>{' '}
              </h1>
            </td>
          </tr>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="gradient-bg-top-course px-[5.5rem]">
        {isLoading && (
          <div>
            <div className="flex animate-pulse flex-col py-8">
              <h1 className="mb-2 w-[30%] rounded-md bg-gray-400 text-4xl font-bold text-transparent">
                Loading Proposal...
              </h1>
            </div>
            {/* hero image */}
            <div className="relative flex h-[200px] w-full animate-pulse items-center justify-center rounded-md bg-main-gray-dark sm:h-[300px] md:h-[400px] lg:h-[600px]"></div>
          </div>
        )}
        {daoEntity && (
          <div>
            <ProposalHeader
              propId={daoEntity.id!!}
              proposer={daoEntity.proposer!!}
              proposerUrl={daoEntity.proposerUrl!!}
              title={daoEntity.title!!}
              tx={daoEntity.tx!!}
              txUrl={daoEntity.txUrl!!}
            />
            {/* Intro and desc */}
            <h1 className="mb-0 text-3xl font-semibold">MORE DATA HERE</h1>
            <p className="font-light">SOON</p>
            <div className="my-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalPage;
