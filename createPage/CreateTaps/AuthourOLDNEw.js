import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { TiArrowSortedDown, TiArrowSortedUp, TiTick } from "react-icons/ti";
import { Slider, Brand, Loader } from "../../components/componentsindex";
import { NFTCardTwo, Banner } from "../../collectionPage/collectionIndex";

//SMART CONTRACT IMPORT
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";
//INTERNAL IMPORT
import Style from "./AuthorTaps.module.css";

const AuthorTaps = ({
  setCollectiables,
  setCreated,
  setLike,
  setFollower,
  setFollowing,
}) => {
  const [openList, setOpenList] = useState(false);
  const [activeBtn, setActiveBtn] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState("Most Recent");
  const [listedNFTsClicked, setListedNFTsClicked] = useState(false);
  const [ownNFTsClicked, setOwnNFTsClicked] = useState(false);
  const [likedClicked, setLikedClicked] = useState(false);
  const [followingClicked, setFollowingClicked] = useState(false);
  const [followersClicked, setFollowersClicked] = useState(false);

  const listArray = [
    "Created By Admin",
    "Most Appreciated",
    "Most Discussed",
    "Most Viewed",
  ];

  const openDropDownList = () => {
    setOpenList(!openList);
  };

  const {
    fetchNFTs,
    setError,
    // currentAccount,
    // fetchMyNFTsOrListedNFTs,
    fetchMyNFTs,
    fetchListedNFTs,
  } = useContext(NFTMarketplaceContext);

  const [nfts, setNfts] = useState([]);
  const [mynfts, setMyNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  const openTab = (e) => {
    const btnText = e.target.innerText;
    console.log(btnText);
    if (btnText == "Listed NFTs") {
      setCollectiables(true);
      setCreated(false);
      setFollower(false);
      setFollowing(false);
      setLike(false);
      setActiveBtn(1);
      setListedNFTsClicked(true);
      setOwnNFTsClicked(false);
      setLikedClicked(false);
      setFollowingClicked(false);
      setFollowersClicked(false);
    } else if (btnText == "Own NFT") {
      setCollectiables(false);
      setCreated(true);
      setFollower(false);
      setFollowing(false);
      setLike(false);
      setActiveBtn(2);
      setListedNFTsClicked(false);
      setOwnNFTsClicked(true);
      setLikedClicked(false);
      setFollowingClicked(false);
      setFollowersClicked(false);
    } else if (btnText == "Liked") {
      setCollectiables(false);
      setCreated(false);
      setFollower(false);
      setFollowing(false);
      setLike(true);
      setActiveBtn(3);
      setListedNFTsClicked(false);
      setOwnNFTsClicked(false);
      setLikedClicked(true);
      setFollowingClicked(false);
      setFollowersClicked(false);
      setNfts([]);
    } else if (btnText == "Following") {
      setCollectiables(false);
      setCreated(false);
      setFollower(false);
      setFollowing(true);
      setLike(false);
      setActiveBtn(4);
      setListedNFTsClicked(false);
      setOwnNFTsClicked(false);
      setLikedClicked(false);
      setFollowingClicked(true);
      setFollowersClicked(false);
    } else if (btnText == "Followers") {
      setCollectiables(false);
      setCreated(false);
      setFollower(true);
      setFollowing(false);
      setLike(false);
      setActiveBtn(5);
      setListedNFTsClicked(false);
      setOwnNFTsClicked(false);
      setLikedClicked(false);
      setFollowingClicked(false);
      setFollowersClicked(true);
    }
  };

  useEffect(() => {
    try {
      if (listedNFTsClicked) {
        fetchListedNFTs().then((items) => {
          setNfts(items?.reverse());
          setNftsCopy(items);
          console.log("listedNFTS", nfts);
        });
      }
    } catch (error) {
      setError("Please reload the browser", error);
    }
  }, [listedNFTsClicked]);

  useEffect(() => {
    try {
      // if (ownNFTsClicked) {
      fetchMyNFTs().then((items) => {
        setMyNfts(items?.reverse());
        console.log("MyNFTS", mynfts);
      });
      // }
    } catch (error) {
      setError("Please reload the browser", error);
    }
  }, []);

  return (
    <div className={Style.AuthorTaps}>
      <div className={Style.AuthorTaps_box}>
        <div className={Style.AuthorTaps_box_left}>
          <div className={Style.AuthorTaps_box_left_btn}>
            <button
              className={`${activeBtn == 1 ? Style.active : ""}`}
              onClick={(e) => openTab(e)}
            >
              Listed NFTs
            </button>
            <button
              className={`${activeBtn == 2 ? Style.active : ""}`}
              onClick={(e) => openTab(e)}
            >
              Own NFT
            </button>
            <button
              className={`${activeBtn == 3 ? Style.active : ""}`}
              onClick={(e) => openTab(e)}
            >
              Liked
            </button>
            <button
              className={`${activeBtn == 4 ? Style.active : ""}`}
              onClick={(e) => openTab(e)}
            >
              Following
            </button>
            <button
              className={`${activeBtn == 5 ? Style.active : ""}`}
              onClick={(e) => openTab(e)}
            >
              Followers
            </button>
          </div>
        </div>

        <div className={Style.AuthorTaps_box_right}>
          <div
            className={Style.AuthorTaps_box_right_para}
            onClick={() => openDropDownList()}
          >
            <p>{selectedMenu}</p>
            {openList ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
          </div>

          {openList && (
            <div className={Style.AuthorTaps_box_right_list}>
              {listArray.map((el, i) => (
                <div
                  key={i + 1}
                  onClick={() => setSelectedMenu(el)}
                  className={Style.AuthorTaps_box_right_list_item}
                >
                  <p>{el}</p>
                  <span>{selectedMenu == el && <TiTick />}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Conditionally render Loader or NFTCardTwo for each section */}
      {listedNFTsClicked &&
        (nfts && nfts.length === 0 ? (
          <Loader />
        ) : (
          <NFTCardTwo NFTData={nfts} />
        ))}
      {ownNFTsClicked &&
        (mynfts && mynfts.length === 0 ? (
          <Loader />
        ) : (
          <NFTCardTwo NFTData={mynfts} />
        ))}
      {likedClicked && <></>}
      {followingClicked && <></>}
      {followersClicked && <></>}
    </div>
  );
};

export default AuthorTaps;
