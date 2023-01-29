import classNames from 'classnames';
import Link from 'next/link';
import { string } from 'zod';
import { proposalStatesEnum } from '~/types/enums';

export type ProposalStatusWidgetProps = {
  statusId: number;
  statusDescription: string;
  size?: 'lg' | 'nm' | 'sm' | 'xs';
  width?: number;
  url?: string;
} & React.ComponentProps<'button'>;

const ProposalStatusWidget = ({
  statusId,
  statusDescription,
  size,
  width,
  url,
}: ProposalStatusWidgetProps) => {
  const innerButton = url ? (
    <Link href={url}>{statusDescription}</Link>
  ) : (
    statusDescription
  );

  const StatusBgColor = () => {
    let buttonBgCollor = '';
    if (statusId == proposalStatesEnum.Defeated)
      buttonBgCollor += ' bg-red-800';
    else if (statusId == proposalStatesEnum.Succeeded)
      buttonBgCollor += 'bg-lime-600';
    else if (statusId == proposalStatesEnum.Active)
      buttonBgCollor += ' bg-blue-700';
    else if (statusId == proposalStatesEnum.Executed)
      buttonBgCollor += 'btn-primary';
    else buttonBgCollor += 'btn-primary';

    return buttonBgCollor; //<button className={buttonCss}>{inner}</button>;
  };

  const buttonClass = () => {
    return `btn btn-${size ?? 'sm'} ${
      width ? `w-${width}` : ''
    } ${StatusBgColor()}`;
  };

  return (
    <Link href={url ?? ''}>
      <button className={buttonClass()}>{innerButton}</button>
    </Link>
  );
};

export default ProposalStatusWidget;
