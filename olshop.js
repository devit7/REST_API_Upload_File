const express = require("express")
const app = express()
const multer = require("multer") // untuk upload file
const path = require("path") // untuk memanggil path direktori
const fs = require("fs") // untuk manajemen file
const mysql = require("mysql")
const cors = require("cors")
const moment = require("moment")

app.use(express.static(__dirname));
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cors())
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "image-" + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({
    storage: storage
})
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "olshop"
})

// semua end-point GET ALL
app.get('/:info', (req, res) => {
    var info = req.params.info
    if (info != 'admin' && info != 'users' && info != 'transaksi' && info != 'barang' && info != 'detail_transaksi') {
        res.json({
            ket: 'Invalid Url'
        })
    } else {
        var sql = "select * from " + info
        db.query(sql, (error, result) => {
            let response = null
            if (error) {
                response = {
                    message: error.message // pesan error
                }
            } else {
                response = {
                    count: result.length, // jumlah data
                    info: result // isi data
                }
            }
            res.json(response) // send response
        })
    }
})

// endpoint untuk menambah data barang 
app.post("/barang", upload.single("image"), (req, res) => {
    // prepare data
    let data = {
        nama_barang: req.body.nama_barang,
        harga: req.body.harga,
        stok: req.body.stok,
        deskripsi: req.body.deskripsi,
        image: req.file.filename
    }

    if (!req.file) {
        // jika tidak ada file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        // create sql insert
        let sql = "insert into barang set ?"

        // run query
        db.query(sql, data, (error, result) => {
            if (error) throw error
            res.json({
                message: result.affectedRows + " data berhasil disimpan"
            })
        })
    }
})
// endpoint untuk menambah data users 
app.post("/users", upload.single("foto"), (req, res) => {
    // prepare data
    let data = {
        id_users: req.body.id_users,
        nama_users: req.body.nama_users,
        alamat: req.body.alamat,
        foto: req.file.filename,
        username: req.body.username,
        password: req.body.password
    }
    if (!req.file) {
        // jika tidak ada file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        // create sql insert
        let sql = "insert into users set ?"
        // run query
        db.query(sql, data, (error, result) => {
            if (error) throw error
            res.json({
                message: result.affectedRows + " data berhasil disimpan"
            })
        })
    }
})


// end-point POST
app.post('/:info', (req, res) => {
    var info = req.params.info
    if (info != 'admin' && info != 'users' && info != 'transaksi' && info != 'barang' && info != 'detail_transaksi') {
        res.json({
            ket: 'Invalid Url'
        })
    } else if (info == 'admin') { //jika admin
        // prepare data
        let data = {
            id_admin: req.body.id_admin,
            nama_admin: req.body.nama_admin,
            username: req.body.username,
            password: req.body.password
        }
        // create sql query insert
        let sql = "insert into admin set ?"
        // run query
        db.query(sql, data, (error, result) => {
            let response = null
            if (error) {
                response = {
                    message: error.message // pesan error
                }
            } else {
                response = {
                    message: result.affectedRows + " data inserted"
                }
            }
            res.json(response) // send response
        })
    } else if (info == 'transaksi') { //jika transaksi
        // prepare data
        let data = {
            kode_transaksi: req.body.kode_transaksi,
            id_users: req.body.id_users,
            tgl_transaksi: moment().format('YYYY-MM-DD HH:mm:ss') // get current time
        }
        // create sql query insert
        let sql = "insert into transaksi set ?"
        // run query
        db.query(sql, data, (error, result) => {
            let response = null
            if (error) {
                response = {
                    message: error.message // pesan error
                }
            } else {
                response = {
                    message: result.affectedRows + " data inserted"
                }
            }
            res.json(response) // send response
        })
    } else if (info == 'detail_transaksi') { //jika detail_transaksi
        // prepare data
        let data = {
            kode_transaksi: req.body.kode_transaksi,
            kode_barang: req.body.kode_barang,
            jumlah: req.body.jumlah,
            harga_beli: req.body.harga_beli
        }
        // create sql query insert
        let sql = "insert into detail_transaksi set ?"
        // run query
        db.query(sql, data, (error, result) => {
            let response = null
            if (error) {
                response = {
                    message: error.message // pesan error
                }
            } else {
                response = {
                    message: result.affectedRows + " data inserted"
                }
            }
            res.json(response) // send response
        })
    }
})
// end-point PUT
app.put('/:info', (req, res) => {
    var info = req.params.info
    if (info != 'admin' && info != 'users' && info != 'transaksi' && info != 'barang' && info != 'detail_transaksi') {
        res.json({
            ket: 'Invalid Url'
        })
    } else if (info == 'admin') { //jika admin
        // prepare data
        let data = [{
                nama_admin: req.body.nama_admin,
                username: req.body.username,
                password: req.body.password
            }, // parameter (primary key)
            {
                id_admin: req.body.id_admin
            }
        ]
        // create sql query update
        let sql = "update admin set ? where ?"
        // run query
        db.query(sql, data, (error, result) => {
            let response = null
            if (error) {
                response = {
                    message: error.message //pesan error
                }
            } else {
                response = {
                    message: result.affectedRows + " data updated"
                }
            }
            res.json(response) // send response
        })
    } else if (info == 'transaksi') { //jika transaksi
        // prepare data
        let data = [{
                id_users: req.body.id_users,
                tgl_transaksi: moment().format('YYYY-MM-DD HH:mm:ss') // get current time
            }, // parameter (primary key)
            {
                kode_transaksi: req.body.kode_transaksi
            }
        ]
        // create sql query update
        let sql = "update transaksi set ? where ?"
        // run query
        db.query(sql, data, (error, result) => {
            let response = null
            if (error) {
                response = {
                    message: error.message // pesan error
                }
            } else {
                response = {
                    message: result.affectedRows + " data updated"
                }
            }
            res.json(response) // send response
        })
    } else if (info == 'detail_transaksi') { //jika detail_transaksi
        // prepare data
        let data = [{
                kode_transaksi: req.body.kode_transaksi,
                kode_barang: req.body.kode_barang,
                jumlah: req.body.jumlah,
                harga_beli: req.body.harga_beli
            }, // parameter (primary key)
            {
                kode_transaksi: req.body.kode_transaksi
            }
        ]
        // create sql query update
        let sql = "update detail_transaksi set ? where ?"
        // run query
        db.query(sql, data, (error, result) => {
            let response = null
            if (error) {
                response = {
                    message: error.message // pesan error
                }
            } else {
                response = {
                    message: result.affectedRows + " data updated"
                }
            }
            res.json(response) // send response
        })
    }
})

// endpoint untuk mengubah data barang by kode
app.put('/barang/:kode', upload.single("image"), (req, res) => {
    var data = null,
        sql = null
    // paramter perubahan data
    var param = {
        kode_barang: req.params.kode
    }

    if (!req.file) {
        // jika tidak ada file yang dikirim = update data saja
        data = {
            nama_barang: req.body.nama_barang,
            harga: req.body.harga,
            stok: req.body.stok,
            deskripsi: req.body.deskripsi
        }
    } else {
        // jika mengirim file = update data + reupload
        data = {
            nama_barang: req.body.nama_barang,
            harga: req.body.harga,
            stok: req.body.stok,
            deskripsi: req.body.deskripsi,
            image: req.file.filename
        }

        // get data yg akan diupdate utk mendapatkan nama file yang lama
        sql = "select * from barang where ?"
        // run query
        db.query(sql, param, (err, result) => {
            if (err) throw err
            // tampung nama file yang lama
            let fileName = result[0].image

            // hapus file yg lama
            let dir = path.join(__dirname, "image", fileName)
            fs.unlink(dir, (error) => {})
        })

    }

    // create sql update
    sql = "update barang set ? where ?"

    // run sql update
    db.query(sql, [data, param], (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil diubah"
            })
        }
    })
})

// endpoint untuk mengubah data users by id
app.put('/users/:id', upload.single("foto"), (req, res) => {
    var data = null,
        sql = null
    // paramter perubahan data
    var param = {
        id_users: req.params.id
    }
    if (!req.file) {
        // jika tidak ada file yang dikirim = update data saja
        data = {
            nama_users: req.body.nama_users,
            alamat: req.body.alamat,
            username: req.body.username,
            password: req.body.password
        }
    } else {
        // jika mengirim file = update data + reupload
        data = {
            nama_users: req.body.nama_users,
            alamat: req.body.alamat,
            foto: req.file.filename,
            username: req.body.username,
            password: req.body.password
        }
        // get data yg akan diupdate utk mendapatkan nama file yang lama
        sql = "select * from users where ?"
        // run query
        db.query(sql, param, (err, result) => {
            if (err) throw err
            // tampung nama file yang lama
            let fileName = result[0].image

            // hapus file yg lama
            let dir = path.join(__dirname, "image", fileName)
            fs.unlink(dir, (error) => {})
        })
    }
    // create sql update
    sql = "update users set ? where ?"
    // run sql update
    db.query(sql, [data, param], (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil diubah"
            })
        }
    })
})


// end-point DELETE
app.delete('/:info/:id', (req, res) => {
    var info = req.params.info
    var param = {
        kode_barang: req.params.id
    }
    if (info != 'admin' && info != 'users' && info != 'transaksi' && info != 'barang' && info != 'detail_transaksi') {
        res.json({
            ket: 'Invalid Url'
        })
    } else if (info == 'barang') {
        // ambil data yang akan dihapus
        let sql = "select * from barang where ?"
        // run query
        db.query(sql, param, (error, result) => {
            if (error) throw error

            // tampung nama file yang lama
            let fileName = result[0].image

            // hapus file yg lama
            let dir = path.join(__dirname, "image", fileName)
            fs.unlink(dir, (error) => {})
        })

        // create sql delete
        sql = "delete from barang where ?"

        // run query
        db.query(sql, param, (error, result) => {
            if (error) {
                res.json({
                    message: error.message
                })
            } else {
                res.json({
                    message: result.affectedRows + " data berhasil dihapus"
                })
            }
        })

    } else {
        if (info == 'admin' || info == 'users') {
            var sql = 'DELETE FROM ' + info + ' WHERE id_' + info + ' = ' + req.params.id
        } else if (info == 'transaksi' || info == 'detail_transaksi') {
            var sql = 'DELETE FROM ' + info + ' WHERE kode_' + info + ' = ' + req.params.id
        }
        db.query(sql, (error, result) => {
            let response = null
            if (error) {
                response = {
                    message: error.message // pesan error
                }
            } else {
                response = {
                    message: result.affectedRows + " data deleted"
                }
            }
            res.json(response) // send response
        })
    }
})

app.listen(8000, () => {
    console.log("Server run on port 8000");
})