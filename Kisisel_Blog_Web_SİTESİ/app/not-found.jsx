import React from 'react'
import Link from 'next/link'

const NotFound = () => {
  return (
    <div className='container h-screen flex flex-col gap-5 justify-center items-center'>
        <h2>Bulunamadı</h2>        
        <p>İstenilen kaynak bulunamadı</p>
        <Link href="/">Anasayfaya Geri Dön</Link>
    </div>
  )
}

export default NotFound