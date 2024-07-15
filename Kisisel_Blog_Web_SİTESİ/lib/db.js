import mongoose from 'mongoose';

export async function connect() {
    try {
        mongoose.connect(process.env.MONGODB_URL);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB başarıyla bağlandı');
        })

        connection.on('error', (err) => {
            console.log('MongoDB bağlantı hatası. Lütfen MongoDB nin çalıştığından emin olun. ' + err);
            process.exit();
        })

    } catch (error) {
        console.log('Birşeyler yanlış gidiyor!');
        console.log(error);
        
    }


}