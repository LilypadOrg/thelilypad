import React from 'react';
import { BigNumber } from 'ethers';
import { Session } from 'next-auth';
import { useDAOVotes } from '~/hooks/useDAOVotes';

const SoonAlert = () => {
  return (
    <div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Comming Soon!</h3>
          <p className="py-4">
            Soon you will be able to participate in the most exciting learning
            path community of history!
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn">
              Yay!
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProposalButton = ({ userAddr }: { userAddr: string }) => {
  let buttonState = 'btn btn-primary btn-lg';
  let votes = BigNumber.from('0');
  const response = useDAOVotes(userAddr ?? '');

  if (!userAddr) buttonState += ' btn-disabled';
  else {
    if (!votes || response.votes?.lte(0)) buttonState += ' btn-disabled';

    votes = response.votes ?? BigNumber.from('0');
  }

  return (
    <label htmlFor="my-modal" className={buttonState}>
      Make Proposal
      <div
        className="badge-polygon-purple badge"
        style={{ marginLeft: '10px', fontSize: '10px' }}
      >
        {!userAddr
          ? 'login'
          : votes.gt(0)
          ? `votes: ${votes.toString()}`
          : 'no votes'}
      </div>
    </label>
  );
};

const GovernanceToolBar = ({ user }: { user: Session['user'] | undefined }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <tr>
          <td
            className="justify-start justify-items-start gap-1"
            style={{
              paddingTop: '5px',
              paddingRight: '0px',
              paddingBottom: '5px',
            }}
          >
            <h4>Proposals</h4>
          </td>
          <td
            className="flex justify-end justify-items-end gap-1"
            style={{
              paddingTop: '5px',
              paddingRight: '0px',
              paddingBottom: '5px',
            }}
          >
            <ProposalButton userAddr={user?.address ?? ''} />
            <SoonAlert />
          </td>
        </tr>
      </table>
    </div>
  );
};

// GovernanceTreasury.displayName = 'GovernanceTreasury';

export default GovernanceToolBar;
