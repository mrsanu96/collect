import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import NFTABI from "./NFTMarketplace.json";

//INTERNAL  IMPORT
import {
  NFTMarketplaceAddress,
  NFTMarketplaceABI,
  transferFundsAddress,
  transferFundsABI,
} from "./constants";

//---FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );

//---CONNECTING WITH SMART CONTRACT

const connectingWithSmartContract = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(NFTMarketplaceAddress, NFTABI, signer);

    console.log(contract);
  } catch (error) {
    console.log("Something went wrong while connecting with contract", error);
  }
};

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Discover, collect, and sell NFTs";

  //------USESTAT
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const router = useRouter();

  //---CHECK IF WALLET IS CONNECTD

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        // console.log(accounts[0]);
      } else {
        // setError("No Account Found");
        // setOpenError(true);
        console.log("No account");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const getBalance = await provider.getBalance(accounts[0]);
      const bal = ethers.utils.formatEther(getBalance);
      setAccountBalance(bal);
    } catch (error) {
      // setError("Something wrong while connecting to wallet");
      // setOpenError(true);
      console.log("not connected");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  //---CONNET WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected Accounts:", accounts);

      setCurrentAccount(accounts[0]);

      connectingWithSmartContract();
    } catch (error) {
      // Handle error if any
      setError("Error while connecting to wallet");
      setOpenError(true);
    }
  };

  const handleConnectWallet = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected Accounts:", accounts);

      setCurrentAccount(accounts[0]);

      connectingWithSmartContract();

      // Send account to your API route for checking/creating user
      try {
        const response = await fetch(
          `/api/connectWallet?walletAddress=${accounts[0]}`
        );
        const data = await response.json();
        if (data.success) {
          console.log(data.message);
        } else {
          console.log("Failed to connect wallet:", data.message);
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } catch {}
  };

  //---UPLOAD TO IPFS FUNCTION
  const uploadToPinata = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `afe8c9dd5234809ff0ca`,
            pinata_secret_api_key: `
            87e274f04806377fe0605fcdcd979554edbcaa087ff8fe40b463fe85f2059c96`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

        return ImgHash;
      } catch (error) {
        console.log("Unable to upload image to Pinata");
      }
    }
  };

  //---CREATENFT FUNCTION
  const createNFT = async (name, price, image, description, router) => {
    if (!name || !description || !price || !image)
      return setError("Data Is Missing"), setOpenError(true);

    const data = JSON.stringify({ name, description, image });

    try {
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `afe8c9dd5234809ff0ca`,
          pinata_secret_api_key: `
          87e274f04806377fe0605fcdcd979554edbcaa087ff8fe40b463fe85f2059c96`,
          "Content-Type": "application/json",
        },
      });

      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log(url);

      await createSale(url, price, name);

      router.push("/searchPage");
    } catch (error) {
      setError("Error while creating NFT");
      setOpenError(true);
    }
  };

  //--- createSale FUNCTION
  const createSale = async (url, formInputPrice, name, isReselling, id) => {
    try {
      console.log(url, formInputPrice,currentAccount, name, isReselling, id);
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        NFTMarketplaceAddress,
        NFTABI,
        signer
      );
      const price = ethers.utils.parseUnits(formInputPrice, "ether");
      const tokenName = name;
      const tokenPrice = formInputPrice;
      const walletAddress=currentAccount;
      // const contract = await connectingWithSmartContract();

      const listingPrice = await contract.getListingPrice();

      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(id, price, {
            value: listingPrice.toString(),
          });

      await transaction.wait();   
      if (transaction) {
        const response = await fetch("/api/nftToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tokenName, tokenPrice, walletAddress}),
        });
        if (response.ok) {
          console.log("Child data saved successfully.");
        } else {
          console.log("Failed to save child data.");
        }
      }
      console.log(transaction);
    } catch (error) {
      setError("error while creating sale");
      setOpenError(true);
      console.log(error);
    }
  };

  //--FETCHNFTS FUNCTION

  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        NFTMarketplaceAddress,
        NFTABI,
        signer
      );

      const data = await contract.fetchMarketItems();

      console.log(data);

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const {
              data: { image, name, description },
            } = await axios.get(tokenURI, {});
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );
      return items;

      // }
    } catch (error) {
      // setError("Error while fetching NFTS");
      // setOpenError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  //--FETCHING MY NFT OR LISTED NFTs
  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );

      if (currentAccount) {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          NFTMarketplaceAddress,
          NFTABI,
          signer
        );
        const data =
          type == "fetchItemsListed"
            ? await contract.fetchItemsListed()
            : await contract.fetchMyNFTs();

        const items = await Promise.all(
          data.map(
            async ({ tokenId, seller, owner, price: unformattedPrice }) => {
              const tokenURI = await contract.tokenURI(tokenId);
              const {
                data: { image, name, description },
              } = await axios.get(tokenURI);
              const price = ethers.utils.formatUnits(
                unformattedPrice.toString(),
                "ether"
              );

              return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI,
              };
            }
          )
        );

        return items;
      }
    } catch (error) {
      // setError("Error while fetching listed NFTs");
      // setOpenError(true);
    }
  };

  useEffect(() => {
    fetchMyNFTsOrListedNFTs();
  }, []);

  const fetchOwnNFTs = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      console.log(window.ethereum.selectedAddress);
      if (window.ethereum.selectedAddress) {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          NFTMarketplaceAddress,
          NFTABI,
          signer
        );
        const data = await contract.fetchMyNFTs();
        console.log("data2", data);
        const items = await Promise.all(
          data.map(
            async ({ tokenId, seller, owner, price: unformattedPrice }) => {
              const tokenURI = await contract.tokenURI(tokenId);
              const {
                data: { image, name, description },
              } = await axios.get(tokenURI);
              const price = ethers.utils.formatUnits(
                unformattedPrice.toString(),
                "ether"
              );

              return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI,
              };
            }
          )
        );

        return items;
      }
    } catch (error) {
      // setError("Error while fetching listed NFTs");
      // setOpenError(true);
    }
  };

  useEffect(() => {
    fetchOwnNFTs();
  }, []);

  const fetchListedNFTs = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );

      // if (currentAccount) {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        NFTMarketplaceAddress,
        NFTABI,
        signer
      );
      const data = await contract.fetchItemsListed();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );

      return items;
      // }
    } catch (error) {
      // setError("Error while fetching listed NFTs");
      // setOpenError(true);
    }
  };

  useEffect(() => {
    fetchListedNFTs();
  }, []);


  const fetchUserListedNFTs = async (address) => {
  console.log("NFT Walllet check", address)
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );

      // if (currentAccount) {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        NFTMarketplaceAddress,
        NFTABI,
        signer
      );
      const data = await contract.fetchUserListedNFTs(address);
      console.log("NFT Walllet data", data)
      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );

      return items;
      // }
    } catch (error) {
      // setError("Error while fetching listed NFTs");
      // setOpenError(true);
    }
  };

  useEffect(() => {
    fetchUserListedNFTs();
  }, []);
  //---BUY NFTs FUNCTION
  const buyNFT = async (nft) => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        NFTMarketplaceAddress,
        NFTABI,
        signer
      );
      // const contract = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });

      await transaction.wait();
      router.push("/author");
    } catch (error) {
      setError("Error While buying NFT");
      setOpenError(true);
    }
  };

  return (
    <NFTMarketplaceContext.Provider
      value={{
        uploadToPinata,
        checkIfWalletConnected,
        connectWallet,
        createNFT,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        fetchOwnNFTs,
        fetchListedNFTs,
        createSale,
        currentAccount,
        titleData,
        setOpenError,
        openError,
        error,
        accountBalance,
        handleConnectWallet,
        fetchUserListedNFTs,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
