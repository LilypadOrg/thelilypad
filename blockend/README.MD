@everyone

FAQ 

1. What is The Lily Pad?

- The Lily Pad is a community which endeavours to support the growth and development of those self-learning, with a focus on Web3 development and coding.

2. How does The Lily Pad help?
 
 - The community is comprised of self-learning developers. We know the vast ocean of resources available online can be intimidating, or easy to get lost in. The Lily Pad's goal is to provide curated content, that's been completed by it's members, compiled in a such a way as to easily track the progress of a growing developer through member profiles, completion tracking and the use of Soulbound Tokens.

 3. What are some of the expected features of The Lily Pad?

 - The Lily Pad web portal will be the ultimate hub for those looking for structure in their self-learning journey. Sections of this hub will include:
    - Member Profile - tracks completed modules, experience/levels gained, and events/projects in which the member participates
    - Project Spotlights - an area to showcase and broadcast community creations
    - The Swamp - a discussion board dedicated to helping each other overcome hurdles in coding
    - Resources and Modules - this will be a collection of curated self-learning content. Freely available to anyone, but structured by language, difficulty and project type. Examples of modules may include, SpeedRunEthereum, the infamous 32hr course, CryptoZombies as well as community content!
    - Events - a section that highlights upcoming coding events and hackathons
    - Member Internships - we know it can be overwhelming to finish a course and not know how to apply the things you've learnt we'll have projects ready for team applications to show off your new skills. Incentives to include free Soulbound Tokens, profile experience and accolades, as well as having your creations advertised and showcased in community spaces
    - FroggyDAO - a place for the community to voice their opinions and seek funding for the development of personal projects

 4. What is a Soulbound Token?

 - Soulbound Tokens are NFTs which cannot be traded. Once minted a holder will retain ownership permenantly. Only through burning the token can a holder renounce ownership. Soulbound Tokens in The Lily Pad will be used as a measure of a member's progress. They will evolve as you do, gaining levels and reflecting the projects you've built and the ways you've contributed through art and token properties. These will be an exciting way to show the world how far you've come as a developer!

 In addition to the above, a member who opts to mint a Soulbound Token will gain the right to earn DAO participation as well as donations/tips through helping others in the community discussion board (The Swamp). These members will receive priority access to limited registration events and project collaboration opportunities.

 5. How can I help!?

- We're glad you asked! The TLP dev team is hard at work to bring the portal to life in the very near future, we need everyone in the community to raise awareness and draw curious coders into our ecosystem. Our biggest hurdle will be growing our reach such that fledgling developers know what we offer and how we can help them succeed.

- We also need Dapps! Any Dapp. Any project you want to make, we want to show the world what you did. Make something amazing and show it off in our Discord, we will reach out to you to ensure it's showcased appropriately when we're live.


If you have any other questions, please reach out to me. I'm nearly always available and happy to clarify our vision. We're excited to build this space and to have everyone be involved, growing together! - Eq :heart:

## For Developers 👋

---

# 🏄‍♂️ Getting Started Locally

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork nft:

```bash
git clone https://github.com/LilypadOrg/nft.git
```

> install and start your 👷‍ Hardhat node:

```bash
cd nft
yarn install
yarn hardhat node
```

> in a second terminal window, To run whole process (createMember -> upgradeContract -> takeFirstStep -> levelUpMember) i.e run all scripts in scripts dir in order 🏃‍♂️ use  :

```bash
yarn execute
```

> You can even run each script individually : 

```bash
yarn createMember 
yarn upgradeToV2
yarn takeFirstStep
yarn levelMember
```