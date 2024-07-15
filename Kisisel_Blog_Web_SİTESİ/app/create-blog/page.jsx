"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextArea from "@/components/TextArea";
import demoImage from '@/public/img/demo_image.jpg'
import Image from 'next/image'

const initialState = {
  title: "",
  description: "",
  excerpt: "",
  quote: "",
  category: "Yazılım",
  photo: "",
};

const CreateBlog = () => {

  const CLOUD_NAME = 'dbit3dk23'; // Ya da process.env.REACT_APP_CLOUD_NAME
  const UPLOAD_PRESET = 'buraksaldirblog_images';

  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const {data: session, status} = useSession();


  if(status === "loading") {                   //Oturum Kontrölü
    return <p>Yükleniyor...</p>
  }

  if(status === "unauthenticated") {
    return <p>Erişim engellendi</p>
  }

  const handleChange = (event) => {
    setError("")
    const {name, value, type, files} = event.target;

    if(type === 'file') {
      setState({...state, [name]: files[0]});
    } else {
      setState({...state, [name]: value})
    }
  };
console.log(session)
  const handleSubmit = async(e) => {
    e.preventDefault();

    const {photo, title, category, description, excerpt, quote} = state;

    if(!title || !description || !category || !excerpt || !quote) {
      setError("Lütfen Tüm Alanları doldurunuz");
      return;
    }

    if(photo) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if(photo.size > maxSize) {
        setError('Dosya boyutu çok büyük. Lütfen 5 MB altında bir dosya seçin.');
        return;
      }
    }

    if (title.length < 4) {
      setError("Başlık en az 4 karakter uzunluğunda olmalıdır.");
      return;
    }

    if (description.length < 20) {
      setError("Açıklama en az 20 karakter uzunluğunda olmalıdır.");
      return;
    }

    if (excerpt.length < 10) {
      setError("Alıntı en az 10 karakter uzunluğunda olmalıdır.");
      return;
    }

    if (quote.length < 6) {
      setError("Alıntı en az 6 karakter uzunluğunda olmalıdır.");
      return;
    }
    
    try{
      setIsLoading(true);
      setError("")
      setSuccess("")
      const image = await uploadImage();

      const newBlog = {
        title,
        description,
        excerpt,
        quote,
        category,
        image,
        authorId: session?.user?._id
      }

      const response = await fetch("http://localhost:3000/api/blog", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`
        },
        method: "POST",
        body: JSON.stringify(newBlog)
      })
      if(response?.status === 201) {
        setSuccess("Blog başarıyla oluşturuldu.");
        setTimeout(() => {
          router.refresh();
          router.push("/blog")
        }, 1500); 
      } else {
        setError("Blog oluşturulurken hata oluştu.")
      }
    } catch(error) {
      console.log(error);
      setError("Blog oluşturulurken hata oluştu.")
    }

    setIsLoading(false)
  }

  const uploadImage = async () => {
    if(!state.photo) return;

    const formdata = new FormData();

    formdata.append('file', state.photo);
    formdata.append("upload_preset", UPLOAD_PRESET);

    try{
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formdata
      });

      const data = await res.json();
      const image = {
        id: data["public_id"],
        url: data['secure_url']
      }

      return image;
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <section className="container max-w-3xl">
      <h2 className="mb-5">
        <span className="special-word">Blog</span> Oluştur
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Title"
          type="text"
          name="title"
          placeholder="Write you title here..."
          onChange={handleChange}
          value={state.title}
        />

        <TextArea
          label="Description"
          rows="4"
          name="description"
          placeholder="Write you description here..."
          onChange={handleChange}
          value={state.description}
        />

        <TextArea
          label="Excerpt"
          rows="2"
          name="excerpt"
          placeholder="Write you excerpt here..."
          onChange={handleChange}
          value={state.excerpt}
        />

        <TextArea
          label="Quote"
          rows="2"
          name="quote"
          placeholder="Write you quote here..."
          onChange={handleChange}
          value={state.quote}
        />

           <div>
          <label className="block">Bir Seçenek Seçin</label>
          <select
            name="category"
            onChange={handleChange}
            value={state.category}
            className="block rounded-lg w-full p-3 bg-primaryColorLight"
          >
         <option value="Yazılım">Yazılım Hakkkında Yazılar</option>
            <option value="Sirket">Şirket Yazıları</option>
            <option value="Web">Web Tasarım ve Yazılım Yazıları</option>
            <option value="Mobil">Mobil Tasarım ve Yazılım Yazıları</option>
            <option value="Dünya">Dünya Teknoloji Yazları</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">
          Resim Yükle
          </label>

          <input onChange={handleChange} type="file" name="photo" accept="image/*" />

          {state.photo && (
            <div>
              <Image 
                src={URL.createObjectURL(state.photo)}
                priority
                alt="Sample image"
                width={0}
                height={0}
                sizes="100vw"
                className="w-32 mt-5"
              />
            </div>
          )}

          
        </div>

        {error && <div className="text-red-700">{error}</div>}

        {success && <div className="text-green-700">{success}</div>}

        <button type="submit" className="btn">
          {isLoading ? "Yükleniyor..." : "Oluştur"}
        </button>
      </form>
    </section>
  );
};

export default CreateBlog;
