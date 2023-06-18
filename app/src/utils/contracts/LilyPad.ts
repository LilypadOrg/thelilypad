const LilyPadAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
      },
    ],
    name: 'NotAFrog',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'techId',
        type: 'uint256',
      },
    ],
    name: 'TechNotFound',
    type: 'error',
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
        internalType: 'uint256',
        name: 'techId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'level',
        type: 'uint256',
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
        internalType: 'uint256[]',
        name: 'eventId',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'techId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'level',
        type: 'uint256',
      },
    ],
    name: 'BadgesEarned',
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
            internalType: 'uint256',
            name: 'techId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'level',
            type: 'uint256',
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
        internalType: 'uint256',
        name: '_techId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_level',
        type: 'uint256',
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
    name: 'burnBabeBurn',
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
        internalType: 'address',
        name: '_member',
        type: 'string',
      },
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
            internalType: 'uint256',
            name: 'techId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'level',
            type: 'uint256',
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
        components: [
          {
            internalType: 'uint256',
            name: 'techId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'techName',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Technology[]',
        name: '_technologies',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'techId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'level',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'badge',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.TechBadge[]',
        name: '_badges',
        type: 'tuple[]',
      },
    ],
    name: 'createTechnology',
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
        internalType: 'uint256',
        name: '_techId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_level',
        type: 'uint256',
      },
    ],
    name: 'getAwardedBadge',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'eventId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'techId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'level',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'badge',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Accolade',
        name: '',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'badgeIndex',
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
            name: 'techId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'techName',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Technology[]',
        name: 'eventTechs',
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
            internalType: 'uint256',
            name: 'techId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'level',
            type: 'uint256',
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
            internalType: 'uint256',
            name: 'techId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'level',
            type: 'uint256',
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
        internalType: 'uint256',
        name: '_technologyId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'level',
        type: 'uint256',
      },
    ],
    name: 'getTechBadge',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'techId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'level',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'badge',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.TechBadge',
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
        name: '_technologyId',
        type: 'uint256',
      },
    ],
    name: 'getTechnology',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'techId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'techName',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Technology',
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
        components: [
          {
            internalType: 'uint256',
            name: 'techId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'techName',
            type: 'bytes',
          },
        ],
        internalType: 'struct ILilyPad.Technology[]',
        name: '_technologies',
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
        name: '_techId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_level',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_badge',
        type: 'bytes',
      },
    ],
    name: 'submitBadge',
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
        internalType: 'uint256',
        name: '_level',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '_technologies',
        type: 'uint256[]',
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
        internalType: 'uint256[]',
        name: '_technologies',
        type: 'uint256[]',
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
            internalType: 'uint256',
            name: 'techId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'level',
            type: 'uint256',
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
] as const;

export default LilyPadAbi;
