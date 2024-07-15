"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextArea from "@/components/TextArea";
import demoImage from "@/public/img/demo_image.jpg";
import Image from "next/image";
import { deletePhoto } from "@/actions/uploadActions";

const initialState = {
  title: "",
  description: "",
  excerpt: "",
  quote: "",
  category: "Yazılım Bilişim",
  photo: {},
  blogId: "",
  newImage: "",
};

const EditBlog = ({ params }) => {
  const CLOUD_NAME = "dq3sduyht";
  const UPLOAD_PRESET = "nextjs_blog_images";

  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
console.log(state)
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`http://localhost:3000/api/blog/${params.id}`);

        if (res.status === 200) {
          const blogData = await res.json();

          setState((prevstate) => ({
            ...prevstate,
            title: blogData.title,
            description: blogData.description,
            excerpt: blogData.excerpt,
            quote: blogData.quote,
            category: blogData.category,
            photo: blogData.image,
            blogId: blogData._id,
          }));
        } else {
          setError("Blog verileri alınırken hata oluştu");
        }
      } catch (error) {
        setError("Blog verileri alınırken hata oluştu");
      }
    }

    fetchBlog();
  }, [params.id]);

  if (status === "loading") {
    return <p>Yükleniyor...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Erişim engellendi</p>;
  }

  const handleChange = (event) => {
    setError("");
    const { name, value, type, files } = event.target;

    if (type === "file") {
      setState({ ...state, [name]: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { newImage, title, category, description, excerpt, quote } = state;

    if (!title || !description || !category || !excerpt || !quote) {
      setError("Lütfen tüm gerekli alanları doldurunuz.");
      return;
    }

    if (newImage) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (newImage.size > maxSize) {
        setError("Dosya boyutu çok büyük. Lütfen 5 MB'ın altında bir dosya seçin.");
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

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      let image;

      if (state.newImage) {
        image = await uploadImage();

        if (state.photo?.id) {
          await deletePhoto(state.photo.id);
        }
      } else {
        image = state.photo;
      }

      const updateBlog = {
        title,
        description,
        excerpt,
        quote,
        category,
        image,
        authorId: session?.user?._id,
      };

      const response = await fetch(
        `http://localhost:3000/api/blog/${params.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "PUT",
          body: JSON.stringify(updateBlog),
        }
      );

      if (response?.status === 200) {
        setSuccess("Blog başarıyla güncellendi.");
        setTimeout(() => {
          router.refresh();
          router.push(`/blog/${params.id}`);
        }, 1500);
      } else {
        setError("Blog güncellenirken hata oluştu.");
      }
    } catch (error) {
      console.log(error);
      setError("Blog güncellenirken hata oluştu.");
    }

    setIsLoading(false);
  };

  const uploadImage = async () => {
    if (!state.newImage) return;

    const formdata = new FormData();

    formdata.append("file", state.newImage);
    formdata.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formdata,
        }
      );

      const data = await res.json();
      const image = {
        id: data["public_id"],
        url: data["secure_url"],
      };

      return image;
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancleUploadImg = () => {
    setState({ ...state, ["newImage"]: "" });
  };

  return (
    <section className="container max-w-3xl">
      <h2 className="mb-5">
        <span className="special-word">Güncelle</span> Bloğu
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Title"
          type="text"
          name="title"
          placeholder="Başlığınızı buraya yazın..."
          onChange={handleChange}
          value={state.title}
        />

        <TextArea
          label="Description"
          rows="4"
          name="description"
          placeholder=" Açıklamanızı buraya yazın..."
          onChange={handleChange}
          value={state.description}
        />

        <TextArea
          label="Excerpt"
          rows="2"
          name="excerpt"
          placeholder="Alıntıyı buraya yazın..."
          onChange={handleChange}
          value={state.excerpt}
        />

        <TextArea
          label="Quote"
          rows="2"
          name="quote"
          placeholder="Alıntı yaptığınızı buraya yazın..."
          onChange={handleChange}
          value={state.quote}
        />

        <div>
          <label className="block">Bir seçenek seçin</label>
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
          <label className="block mb-2 text-sm font-medium">Resim Yükle</label>

          <input
            onChange={handleChange}
            type="file"
            name="newImage"
            accept="image/*"
          />

          {state.newImage ? (
            <div>
              <Image
                src={URL.createObjectURL(state.newImage)}
                priority
                alt="Sample image"
                width={0}
                height={0}
                sizes="100vw"
                className="w-32 mt-5"
              />

              <button onClick={handleCancleUploadImg}>İptal</button>
            </div>
          ) : (
            <div>
              {state.photo && state.photo["url"] && (
                <div>
                  <Image
                    src={state.photo.url}
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
          )}
        </div>

        {error && <div className="text-red-700">{error}</div>}

        {success && <div className="text-green-700">{success}</div>}

        <button type="submit" className="btn">
          {isLoading ? "Loading..." : "Edit"}
        </button>
      </form>
    </section>
  );
};

export default EditBlog;
