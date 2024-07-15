// http://localhost:3000/api/blog/blogid/comment/commentId

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";

export async function DELETE(req, res) {
    await connect();
  
    const id = res.params.id;
    const commentId = res.params.commentId;
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
      const blog = await Blog.findById(id).populate("authorId").populate("comments.user");  //veritabanı işlemleri

      const comment = blog.comments.find(comment => comment.id === commentId);

      if(!comment) {
        return NextResponse.json(
            { mes: "Yorum mevcut değil" },
            {status: 404}
        )
      }
  
      if (comment?.user?._id.toString() !== decodedToken._id.toString()) {
        return NextResponse.json(
          { msg: "Yorumunu yalnızca admin silebilir" },
          { status: 403 }
        );
      }
  
      blog.comments = blog.comments.filter(comment => comment.id !== commentId);   

      await blog.save(); //veritabanına kaydet
  
      return NextResponse.json({msg: "Yorum başarıyla silindi"}, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Hata Silinemedi" }, {status: 500});
    }
  }