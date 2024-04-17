import connectToDatabase from "../../lib/mongodb";
import NFTDATAMODEL from "../../model/nftDetails";

async function nftToken(req, res) {
  if (req.method === "POST") {
   

    try {
      const { tokenName, tokenPrice, walletAddress } = req.body;
      await connectToDatabase();

      const lastToken = await NFTDATAMODEL.findOne({}).sort({ tokenId: -1 });
      if (lastToken) {
        const newTokenId = lastToken.tokenId + 1;
        console.log("Last Token:", lastToken);
        console.log("New Token ID:", newTokenId);
      } else {
        console.log("No tokens found in the collection.");
      }

      const newTokenId = lastToken ? lastToken.tokenId + 1 : 1;
      console.log("New Token ID:", newTokenId);

      const result = await NFTDATAMODEL.create({
        tokenId: newTokenId,
        tokenName,
        tokenPrice,
        walletAddress,
      });

      console.log(`Inserted ${result.insertedCount} document`);

      res.status(201).json({ message: "Token details inserted successfully" });
    } catch (error) {
      console.error("Error inserting token details:", error);
      res.status(500).json({ message: "Error inserting token details" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default nftToken;
