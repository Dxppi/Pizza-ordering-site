// Импорты
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const ejs = require('ejs');

// Настройки базы данных
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pizza_order',
  password: 'Plekhanov',
  port: 5432,
});

// Создание приложения Express
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Установка EJS в качестве шаблонизатора
app.set('view engine', 'ejs');

// Главная страница
app.get('/', async (req, res) => {
    try {
      const pizzasResult = await pool.query('SELECT * FROM pizzas');
      const reviewsResult = await pool.query(
        `SELECT f.feedback, o.name AS customer_name, p.name AS pizza_name
         FROM feedback f
         JOIN orders o ON f.order_id = o.id
         JOIN pizzas p ON o.pizza_id = p.id`
      );
  
      res.render('index', { pizzas: pizzasResult.rows, reviews: reviewsResult.rows });
    } catch (err) {
      res.status(500).send('Ошибка при загрузке главной страницы.');
    }
  });
  

// Страница конкретной пиццы
app.get('/pizza/:id', async (req, res) => {
  try {
    const pizzaId = req.params.id;
    const pizzaResult = await pool.query('SELECT * FROM pizzas WHERE id = $1', [pizzaId]);
    const ingredientsResult = await pool.query('SELECT * FROM ingredients WHERE pizza_id = $1', [pizzaId]);

    if (pizzaResult.rowCount === 0) {
      return res.status(404).send('Пицца не найдена.');
    }

    res.render('pizza', { pizza: pizzaResult.rows[0], ingredients: ingredientsResult.rows });
  } catch (err) {
    res.status(500).send('Ошибка при загрузке данных о пицце.');
  }
});

// Оформление заказа
app.post('/checkout', async (req, res) => {
  try {
    const { pizza_id, ingredients = [], address, name, phone } = req.body;
    const pizzaResult = await pool.query('SELECT price FROM pizzas WHERE id = $1', [pizza_id]);
    const pizzaPrice = pizzaResult.rows[0].price;

    let total = Number(pizzaPrice);
    if (ingredients.length > 0) {
      const ingredientsResult = await pool.query(
        'SELECT SUM(price) as additional_cost FROM ingredients WHERE id = ANY($1::int[])',
        [ingredients]
      );
      total += parseFloat(ingredientsResult.rows[0].additional_cost);
    }

    const orderResult = await pool.query(
      'INSERT INTO orders (pizza_id, ingredients, address, name, phone, total_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [pizza_id, ingredients, address, name, phone, total]
    );

    const orderId = orderResult.rows[0].id;
    res.render('checkout', { total, orderId });
  } catch (err) {
    res.status(500).send('Ошибка при оформлении заказа.');
  }
});

// Страница отзывов
app.get('/review/:order_id', async (req, res) => {
  try {
    const orderId = req.params.order_id;

    const orderResult = await pool.query(
      `SELECT o.*, p.name AS pizza_name
       FROM orders o
       JOIN pizzas p ON o.pizza_id = p.id
       WHERE o.id = $1`,
      [orderId]
    );

    if (orderResult.rowCount === 0) {
      return res.status(404).send('Заказ не найден.');
    }

    const order = orderResult.rows[0];

    res.render('review', {
      order_id: order.id,
      customer_name: order.name,
      pizza_name: order.pizza_name,
    });
  } catch (err) {
    res.status(500).send('Ошибка при загрузке страницы отзыва.');
  }
});

// Сохранение отзыва
app.post('/review', async (req, res) => {
  try {
    const { order_id, review } = req.body;

    await pool.query('INSERT INTO feedback (order_id, feedback) VALUES ($1, $2)', [order_id, review]);

    res.redirect('/');
  } catch (err) {
    res.status(500).send('Ошибка при сохранении отзыва.');
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});