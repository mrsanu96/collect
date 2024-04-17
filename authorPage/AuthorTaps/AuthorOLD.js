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

  const listArray = [
    "Created By Admin",
    "Most Appreciated",
    "Most Discussed",
    "Most Viewed",
  ];

  const openDropDownList = () => {
    if (!openList) {
      setOpenList(true);
    } else {
      setOpenList(false);
    }
  };

  const {
    fetchNFTs,
    setError,
    currentAccount,
    fetchMyNFTsOrListedNFTs,
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
    } else if (btnText == "Own NFT") {
      setCollectiables(false);
      setCreated(true);
      setFollower(false);
      setFollowing(false);
      setLike(false);
      setActiveBtn(2);
    } else if (btnText == "Liked") {
      setCollectiables(false);
      setCreated(false);
      setFollower(false);
      setFollowing(false);
      setLike(true);
      setActiveBtn(3);
    } else if (btnText == "Following") {
      setCollectiables(false);
      setCreated(false);
      setFollower(false);
      setFollowing(true);
      setLike(false);
      setActiveBtn(4);
    } else if (btnText == "Followers") {
      setCollectiables(false);
      setCreated(false);
      setFollower(true);
      setFollowing(false);
      setLike(false);
      setActiveBtn(5);
    }
  };

  useEffect(() => {
    try {
      //  if (currentAccount) {
      fetchListedNFTs().then((items) => {
        setNfts(items?.reverse());
        setNftsCopy(items);
        console.log("MyNFTS", nfts);
      });
      //   }
    } catch (error) {
      setError("Please reload the browser", error);
    }
  }, []);

  useEffect(() => {
    try {
      //  if (currentAccount) {
      fetchNFTs().then((items) => {
        setMyNfts(items?.reverse());
        setNftsCopy(items);
        console.log("MyNFTS", mynfts);
      });
      //   }
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
      {nfts && nfts.length === 0 ? <Loader /> : <NFTCardTwo NFTData={nfts} />}
    </div>
  );
};

export default AuthorTaps;
