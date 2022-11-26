-- CreateTable
CREATE TABLE "daoFunction" (
    "id" SERIAL NOT NULL,
    "contractAddress" VARCHAR(100) NOT NULL,
    "contractFunction" VARCHAR(100) NOT NULL,
    "functionInputs" TEXT[],
    "functionName" VARCHAR(100) NOT NULL,

    CONSTRAINT "daoFunction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daoProposal" (
    "id" SERIAL NOT NULL,
    "proposer" VARCHAR(100) NOT NULL,
    "targets" TEXT[],
    "signatures" TEXT[],
    "values" TEXT[],
    "calldatas" TEXT[],
    "startBlock" TEXT NOT NULL,
    "endBlock" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "proposalJson" TEXT NOT NULL,
    "status" INTEGER,
    "proposalId" TEXT,
    "eta" INTEGER,
    "params" TEXT[],
    "tx" VARCHAR(200),
    "functionId" INTEGER,
    "snapshotBlock" TEXT,

    CONSTRAINT "daoProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daoProposalVote" (
    "id" SERIAL NOT NULL,
    "voter" VARCHAR(100) NOT NULL,
    "support" INTEGER NOT NULL,
    "weigth" INTEGER NOT NULL,
    "reason" VARCHAR(200),
    "proposalId" TEXT,

    CONSTRAINT "daoProposalVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daoProposal_proposalId_key" ON "daoProposal"("proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "daoProposalVote_proposalId_voter_key" ON "daoProposalVote"("proposalId", "voter");

-- AddForeignKey
ALTER TABLE "daoProposal" ADD CONSTRAINT "daoProposal_functionId_fkey" FOREIGN KEY ("functionId") REFERENCES "daoFunction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daoProposalVote" ADD CONSTRAINT "daoProposalVote_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "daoProposal"("proposalId") ON DELETE SET NULL ON UPDATE CASCADE;
