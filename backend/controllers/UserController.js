const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types  

module.exports = class UserController {

    static async register (req, res) {
        const { name, email, password, confirmpassword} = req.body

        // Validação dos campos obrigatórios
        if (!name) return res.status(422).json({ message: 'O nome é obrigatório.' });
        if (!email) return res.status(422).json({ message: 'O email é obrigatório.' });
        if (!password) return res.status(422).json({ message: 'A senha é obrigatória.' });
        if (!confirmpassword) return res.status(422).json({ message: 'A confirmação de senha é obrigatória.' });
        if (password !== confirmpassword) return res.status(422).json({ message: 'A senha e a confirmação de senha precisam ser iguais.' });

        const userExists = await User.findOne({ email: email})

        if (userExists) {
            res.status(422).json({message: 'Esse e-mail já foi utilizado'})
            return
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            email,
            password: passwordHash,
        })

        try {
            
            const newUser = await user.save();
         
            createUserToken(newUser, req, res); 

        } catch (error) {
            res.status(500).json({message: error})
        }

    }

    static async login(req, res) {

        const {email, password} = req.body

        if(!email) {
            res.status(422).json({message: 'O email é obrigatório.'})
            return 
        }

        if(!password) {
            res.status(422).json({message: 'A senha é obrigatório.'})
            return 
        }

        const user = await User.findOne({ email: email})

        if (!user) {
            res.status(422).json({message: 'Nao ha usuario com esse email.'})
            return
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword) {
            res.status(422).json({message: 'Senha incorreta.'})
            return
        }

        await createUserToken(user, req, res) // Gera o token quando o login é feito

    }

    static async checkUser(req, res) {

        let currentUser

        if(req.headers.authorization) {

            const token = getToken(req)
            const decoded = jwt.verify(token, "nossosecret")

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined

        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)

    }

    static async getUserById(req, res) {

        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: "Id inválido."})
            return
        }

        const user = await User.findById(id).select("-password")

        if(!user) {
            res.status(422).json({message: 'Usuario nao encontrado.'})
            return
        }

        res.status(200).json({user})

    }

    static async editUser(req, res) {
        
        const id = req.params.id

        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, password, confirmpassword} = req.body

        if(req.file){
            user.image = req.file.filename
        }

        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório.'})
            return 
        }

        user.name = name

        if(!email) {
            res.status(422).json({message: 'O email é obrigatório.'})
            return 
        }

        const userExists = await User.findOne({email: email})

        if(user.email !== email && userExists) {
            res.status(422).json({message: "Esse email ja foi usado, use outro."})
            return 
        }

        user.email = email

        if(password !== confirmpassword) {
            res.status(422).json({message: 'A senha e a confirmação de senha é precisam ser iguais.'})
            return
        } else if (password === confirmpassword && password != null){

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash

        }

        try {
            
            await User.findOneAndUpdate(
                {_id: user._id},
                {$set: user},
                {new: true}
            )

            res.status(200).json({message: 'Usuario atualizado com sucesso.'})            

        } catch (error) {
            res.status(500).json({message: error})
            return
        }
    }
}
