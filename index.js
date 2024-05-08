const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const User = require('./models/User');
const Document = require('./models/Document');
const WorkData = require('./models/WorkData');
const generateKey = require('./utils/keyGenerator');

const dataBase = './db/users.json';
app.use(bodyParser.json());

app.post('/user/register', (req, res) => {
    const { name, dateOfBirth, phone, document, workData } = req.body;
    if (!req.body.name || !req.body.dateOfBirth || !req.body.phone || !req.body.document || !req.body.workData) {
        return res.status(400).json({ error: 'Не все данные были заполнены' });
    }

    fs.readFile(dataBase, (err, data) => {
        console.log(dataBase)
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка сервера1' });
        }

        const users = JSON.parse(data);

        // Проверка наличия пользователя
        const existingUser = users.find(user => user.phone === phone );
        console.log(existingUser)
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь уже зарегистрирован' });
        }

        const authKey = generateKey();

        const newUser = new User(name, dateOfBirth, phone, new Document(document.series, document.number, document.issueDate), new WorkData(workData.companyName, workData.companyPhone, workData.address), authKey);

        // Добавляем пользователя в массив
        users.push(newUser);

        fs.writeFile(dataBase, JSON.stringify(users, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Ошибка сервера2' });
            }
            res.status(201).json({ message: 'Пользователь зарегистрирован', authKey });
        });
    });
});

app.post('/user/login', (req, res) => {
    const { authKey } = req.body;

    fs.readFile(dataBase, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка сервера3' });
        }

        const users = JSON.parse(data);

        // Поиск пользователя по токену
        const user = users.find(user => user.authKey === authKey);
        if (user) {
            return res.status(200).json({ message: 'Пользователь найден', name: user.name ,authKey: user.authKey });
        } else {
            return res.status(403).json({ error: 'Пользователь не найден' });
        }
    });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
