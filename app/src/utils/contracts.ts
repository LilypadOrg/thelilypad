/*--------- Localhost --------- */
export const MAIN_CONTRACT_ADDRESS =
  '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

export const SBT_CONTRACT_ADDRESS =
  '0x68B1D87F95878fE05B998F19b66F4baba5De1aed';

/*--------- MUMBAI --------- */
// export const MAIN_CONTRACT_ADDRESS =
//   '0xBfa11E61Bc0a0D811cE66077Ae593D4ae659825D';
// export const SBT_CONTRACT_ADDRESS =
//   '0xf316C6E40f9eCa77145e1288909591ee0249423f';

/* previous */
// export const MAIN_CONTRACT_ADDRESS =
//   '0x745d7986Ad1380d41426F89e43EAEF8c93888b4E';
// export const SBT_CONTRACT_ADDRESS =
//   '0x812f04DA6cCE546E1Bf3027ec7A8FAD55186eC1a';

export const MAIN_CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'member',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'eventId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'badgeIdentifier',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'badgeName',
        type: 'string',
      },
    ],
    name: 'BadgeEarned',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'member',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'eventId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'eventName',
        type: 'string',
      },
    ],
    name: 'EventCompleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'eventId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'eventTypeId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'eventName',
        type: 'bytes',
      },
    ],
    name: 'EventSubmited',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'member',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'currentXp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'level',
        type: 'uint256',
      },
    ],
    name: 'LevelReached',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'member',
        type: 'address',
      },
    ],
    name: 'MemberBurned',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_journeyId',
        type: 'uint256',
      },
    ],
    name: 'abandonJourney',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'member',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'name',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'done',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'badgeObligatory',
            type: 'bool',
          },
        ],
        internalType: 'struct ILilyPad.Journey',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_member',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'eventId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'title',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'badge',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Accolade[]',
        name: '_badges',
        type: 'tuple[]',
      },
      {
        internalType: 'bytes',
        name: '_sig',
        type: 'bytes',
      },
    ],
    name: 'awardBadge',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_member',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_eventId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_accoladeTitle',
        type: 'bytes',
      },
    ],
    name: 'badgeEarned',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'member',
        type: 'address',
      },
    ],
    name: 'burnBabyBurn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_member',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_eventId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_sig',
        type: 'bytes',
      },
    ],
    name: 'completeEvent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_member',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_eventId',
        type: 'uint256',
      },
    ],
    name: 'completedEvent',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_baseUri',
        type: 'string',
      },
    ],
    name: 'constructTokenUri',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'name',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.EventType[]',
        name: '_eventTypes',
        type: 'tuple[]',
      },
    ],
    name: 'createEventType',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_journeyId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_name',
        type: 'bytes',
      },
      {
        internalType: 'bool',
        name: '_badgeObligatory',
        type: 'bool',
      },
      {
        internalType: 'uint256[]',
        name: '_eventId',
        type: 'uint256[]',
      },
    ],
    name: 'createJourney',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'member',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'name',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'done',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'badgeObligatory',
            type: 'bool',
          },
        ],
        internalType: 'struct ILilyPad.Journey',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'level',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'xpInit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'xpFin',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'image',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Level[]',
        name: '_levels',
        type: 'tuple[]',
      },
    ],
    name: 'createLevel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_initialXp',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '_completedEvents',
        type: 'uint256[]',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'eventId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'title',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'badge',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Accolade[]',
        name: '_badges',
        type: 'tuple[]',
      },
      {
        internalType: 'bytes',
        name: '_sig',
        type: 'bytes',
      },
    ],
    name: 'createMember',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'getEvent',
    outputs: [
      {
        internalType: 'uint256',
        name: 'eventTypeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'xp',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'eventId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'title',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'badge',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Accolade[]',
        name: 'accolades',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_eventTypeId',
        type: 'uint256',
      },
    ],
    name: 'getEventType',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'name',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.EventType',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_levelId',
        type: 'uint256',
      },
    ],
    name: 'getLevel',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'level',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'xpInit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'xpFin',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'image',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Level',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_memberAddress',
        type: 'address',
      },
    ],
    name: 'getMember',
    outputs: [
      {
        internalType: 'bool',
        name: 'pathChosen',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'xp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'level',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'DAO',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'completedEvents',
        type: 'uint256[]',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'eventId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'title',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'badge',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Accolade[]',
        name: 'badges',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'getMemberByTokenId',
    outputs: [
      {
        internalType: 'address',
        name: 'memberAddress',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'pathChosen',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'xp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'level',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'DAO',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'completedEvents',
        type: 'uint256[]',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'eventId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'title',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'badge',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Accolade[]',
        name: 'badges',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_memberAddress',
        type: 'address',
      },
    ],
    name: 'getMemberLevel',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_memberAddress',
        type: 'address',
      },
    ],
    name: 'getTokenId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'level',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'xpInit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'xpFin',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'image',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Level[]',
        name: '_levels',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'name',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.EventType[]',
        name: '_eventTypes',
        type: 'tuple[]',
      },
      {
        internalType: 'address',
        name: '_safeCaller',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_member',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_currentXp',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_sig',
        type: 'bytes',
      },
    ],
    name: 'levelMember',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_memberAddress',
        type: 'address',
      },
    ],
    name: 'mintTokenForMember',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'safeCaller',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'sbtAddress',
    outputs: [
      {
        internalType: 'contract IPondSBT',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IPondSBT',
        name: '_newSbtAddress',
        type: 'address',
      },
    ],
    name: 'setSbtAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_eventId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_eventTypeId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_eventName',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: '_xp',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'eventId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'title',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'badge',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Accolade[]',
        name: '_accolades',
        type: 'tuple[]',
      },
      {
        internalType: 'bytes',
        name: '_sig',
        type: 'bytes',
      },
    ],
    name: 'submitEvent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_eventTypeId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_eventName',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: '_xp',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'eventId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'title',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'badge',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Accolade[]',
        name: '_accolades',
        type: 'tuple[]',
      },
      {
        internalType: 'bytes',
        name: '_sig',
        type: 'bytes',
      },
    ],
    name: 'updateEvent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_journeyId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_name',
        type: 'bytes',
      },
      {
        internalType: 'bool',
        name: '_badgeObligatory',
        type: 'bool',
      },
      {
        internalType: 'uint256[]',
        name: '_eventsId',
        type: 'uint256[]',
      },
    ],
    name: 'updateJourney',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'member',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'name',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'done',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'badgeObligatory',
            type: 'bool',
          },
        ],
        internalType: 'struct ILilyPad.Journey',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_memberAddress',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_dao',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_xp',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '_completedEvents',
        type: 'uint256[]',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'eventId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'title',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'badge',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Accolade[]',
        name: '_badges',
        type: 'tuple[]',
      },
      {
        internalType: 'bytes',
        name: '_sig',
        type: 'bytes',
      },
    ],
    name: 'updateMember',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newSafeCaller',
        type: 'address',
      },
    ],
    name: 'updateSafeCaller',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
export const SBT_CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'PondSBT__NotEnoughEth',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'delegator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'fromDelegate',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'toDelegate',
        type: 'address',
      },
    ],
    name: 'DelegateChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'delegate',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'previousBalance',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newBalance',
        type: 'uint256',
      },
    ],
    name: 'DelegateVotesChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'soulOwner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'SoulBounded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatee',
        type: 'address',
      },
    ],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatee',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'delegates',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'getPastTotalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'getPastVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'mintFee',
        type: 'uint256',
      },
      {
        internalType: 'contract ILilyPad',
        name: 'mainContractAddress',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mainContract',
    outputs: [
      {
        internalType: 'contract ILilyPad',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'nonces',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'safeMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_member',
        type: 'address',
      },
    ],
    name: 'takeFirstSteps',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
