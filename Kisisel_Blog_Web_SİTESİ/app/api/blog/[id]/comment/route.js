// http://localhost:3000/api/blog/blogid/comment

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";
import User from "@/models/User";

export async function POST(req, res) {    
  await connect();
  const id = res.params.id;
  const accessToken = req.headers.get("authorization");
  const token = accessToken.split(" ")[1];

  const decodedToken = verifyJwtToken(token);

  if (!accessToken || !decodedToken) {
    return new Response(
      JSON.stringify({ error: "yetkisiz (yanlış veya süresi dolmuş giriş)" }),
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const blog = await Blog.findById(id);
    const user = await User.findById(decodedToken._id);


    //Yorum Oluşturma Ekleme
    const newComment = {
        text: body.text,
        user
    }

    blog.comments.unshift(newComment);

    await blog.save();  

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "POST Hata" });
  }
}