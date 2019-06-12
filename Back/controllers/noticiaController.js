'use-strict'
var Noticia = require('../models/noticiaModel');


function getNoticias(req, res) {

    Noticia.find({}, (err, news) => {
        if (err) {
            res.status(404).send({message: 'Error al consultar Noticias en BBDD'});
        } else if (news) {
            res.status(200).send(news);
        } else {
            res.status(400).send({message: 'No hay noticias en la BBDD'})
        }
    }).sort({fechaPublicacion: -1});
}

function getNewsById(req, res){
    var id = req.params.id;
    Noticia.findById(id, (err, noticia) => {
        if(err){res.status(500).send({message: 'News not found'})}
        else if(noticia) {
            res.status(200).send(noticia);
        }else{
            res.status(404).send({message: 'The requested article does not exist'})
        }
    }).limit(1);
}

module.exports = {
    getNoticias,
    getNewsById
}
