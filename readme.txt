# Method Post -> Insert
# Method GET -> Show data achieved

/POST :
{"nama" : "value",
"no_tlp" : "value",
"kode" : "value",
"tipe" : "W/T"
}

nama => nama
no tlp => tlp
kode => kode referral
tipe => W/T warga atau teman

/referral/:no_tlp
*pertama cek di tbl driver(parent) untuk nomer tlp nya ada gak.
ambil ID nya buat di count di tbl referal nantinya
