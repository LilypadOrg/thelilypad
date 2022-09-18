interface ContentFilterType {
  [x: string]: string | string[] | undefined;
}

declare type ContractWriteFn = (
  overrideConfig?: UseContractWriteMutationArgs
) => void;
