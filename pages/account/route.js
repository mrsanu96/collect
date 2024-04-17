import { NextResponse } from "next/server";
import Account from "../../model/account";

export async function POST(request) {
  const {
    username,
    email,
    description,
    website,
    facebook,
    twitter,
    instagram
  } = await request.json();

  await connectMongoDB();
  await Account.create({ username,
    email,
    description,
    website,
    facebook,
    twitter,
    instagram});
    return NextResponse.json({messsage: "User Created"}, {status: 201})
}
