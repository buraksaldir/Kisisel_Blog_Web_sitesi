// http://localhost:3000/api/blog/someid

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";

export async function PUT(req, res) {
  await connect();

  const id = res.params.id;
  const accessToken = req.headers.get("authorization");
  const token = accessToken.split(" ")[1];

  const decodedToken = verifyJwtToken(token);

  if (!accessToken || !decodedToken) {
    return NextResponse.json(
      { error: "yetkisiz (yanlış veya süresi dolmuş giriş)" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const blog = await Blog.findById(id).populate("authorId");

    if (blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
      return NextResponse.json(
        { msg: "Blogunu yalnızca yazar güncelleyebilir" },
        { status: 403 }
      );
    }

    const updateBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: { ...body } },
      { new: true }
    );

    return NextResponse.json(updateBlog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "PUT error" }, {status: 500});
  }
}

export async function GET(req, res) {
  await connect();

  const id = res.params.id;

  try {
    const blog = await Blog.findById(id)
      .populate({
        path: "authorId",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "GET error" },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req, res) {
    await connect();
  
    const id = res.params.id;
    const accessToken = req.headers.get("authorization");
    const token = accessToken.split(" ")[1];
  
    const decodedToken = verifyJwtToken(token);
  
    if (!accessToken || !decodedToken) {
      return NextResponse.json(
        { error: "yetkisiz (yanlış veya süresi dolmuş giriş)" },
        { status: 403 }
      );
    }
  
    try {
      const blog = await Blog.findById(id).populate("authorId");
  
      if (blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
        return NextResponse.json(
          { msg: "Blogunu yalnızca admin silebilir" },
          { status: 403 }
        );
      }
  
      await Blog.findByIdAndDelete(id)
  
      return NextResponse.json({msg: "Blog başarıyla silindi"}, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Hata Silinemedi" }, {status: 500});
    }
  }
