import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router"; // Import useRouter hook
import Style from "../styles/author.module.css";
import { Banner, NFTCardTwo } from "../collectionPage/collectionIndex";
import { Brand, Title } from "../components/componentsindex";
import FollowerTabCard from "../components/FollowerTab/FollowerTabCard/FollowerTabCard";
import images from "../img";
import {
  CreateProfileCard,
  CreateTaps,
  CreateNFTCardBox,
} from "../createPage/componentIndex";

//IMPORT SMART CONTRACT DATA
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const creator = () => {
  const router = useRouter(); // Initialize useRouter hook
  const followerArray = [
    {
      background: images.creatorbackground1,
      user: images.user1,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground2,
      user: images.user2,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground3,
      user: images.user3,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground4,
      user: images.user4,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground5,
      user: images.user5,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground6,
      user: images.user6,
      seller: "7d64gf748849j47fy488444",
    },
  ];

  const [collectiables, setCollectiables] = useState(true);
  const [created, setCreated] = useState(false);
  const [like, setLike] = useState(false);
  const [follower, setFollower] = useState(false);
  const [following, setFollowing] = useState(false);
  const [walletAddress, setWalletaddress] = useState(false);
  const [userWallet, setUserWallet] = useState(false);

  //IMPORT SMART CONTRACT DATA
  const { currentAccount, fetchOwnNFTs, fetchListedNFTs, fetchUserListedNFTs } =
    useContext(NFTMarketplaceContext);

  const [nfts, setNfts] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);

  useEffect(() => {
    if (!router.isReady) return;
    setWalletaddress(router.query);
    console.log("router", router.query.walletAddress);
    console.log("setWA", walletAddress);
    setUserWallet(router.query.walletAddress);
  }, [router.isReady]);

  console.log("check1", userWallet);
  useEffect(() => {
    if (userWallet) {
      try {
        console.log("check2", userWallet);
        fetchUserListedNFTs(userWallet).then((items) => {
          setNfts(items);
          console.log("creator item", items)
        });
      } catch (error) {
        console.error("Error fetching listed NFTs:", error);
      }
    }
  }, [userWallet]);

  return (
    <div className={Style.author}>
      <Banner bannerImage={images.creatorbackground2} />
      <CreateProfileCard currentAccount={walletAddress.walletAddress} />
      <CreateTaps
        setCollectiables={setCollectiables}
        setCreated={setCreated}
        setLike={setLike}
        setFollower={setFollower}
        setFollowing={setFollowing}
        currentAccount={walletAddress.walletAddress}
      />

      <CreateNFTCardBox
        collectiables={collectiables}
        created={created}
        like={like}
        follower={follower}
        following={following}
        nfts={nfts}
        myNFTS={myNFTs}
      />
      <Title
        heading="Popular Creators"
        paragraph="Click on music icon and enjoy NTF music or audio"
      />
      <div className={Style.author_box}>
        {followerArray.map((el, i) => (
          <FollowerTabCard key={i} el={el} />
        ))}
      </div>
    </div>
  );
};

export default creator;
