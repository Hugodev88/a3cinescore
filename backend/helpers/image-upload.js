const multer = require('multer');
const path = require('path');

// Definindo onde os arquivos serão armazenados e com qual nome
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = '';

        if (req.baseUrl.includes('users')) {
            folder = 'users';
        } else if (req.baseUrl.includes('movies')) {
            folder = 'movies';
        }

        cb(null, `public/images/${folder}`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname));
    }
});

// Configuração do multer com limite de tamanho e filtro de arquivos
const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Limite de 10MB por arquivo
    },
    fileFilter(req, file, cb) {
        try {
            if (file.fieldname !== 'photo') {
                return cb(new Error('Nome do campo inválido. Deve ser "photo".'), false);
            }

            // Verifica se a extensão do arquivo é png ou jpg
            if (!file.originalname.toLowerCase().match(/\.(png|jpg)$/)) {
                return cb(new Error('Por favor, envie apenas arquivos com extensão jpg ou png.'), false);
            }

            cb(null, true); // Arquivo aceito
        } catch (error) {
            cb(error, false); // Caso ocorra algum erro
        }
    }
});

module.exports = { imageUpload };
