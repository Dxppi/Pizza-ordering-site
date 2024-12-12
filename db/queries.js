const pool = require('./config');

const getAllPizzas = async () => {
    const result = await pool.query('SELECT * FROM pizzas');
    return result.rows;
};

const getPizzaById = async (id) => {
    const result = await pool.query('SELECT * FROM pizzas WHERE id = $1', [id]);
    return result.rows[0];
};

const getIngredientsByPizzaId = async (pizzaId) => {
    const result = await pool.query('SELECT * FROM ingredients WHERE pizza_id = $1', [pizzaId]);
    return result.rows;
};

const saveOrder = async (pizzaId, ingredients, address, name, phone) => {
    const result = await pool.query(
        'INSERT INTO orders (pizza_id, ingredients, address, name, phone, total_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [pizzaId, ingredients, address, name, phone, totalPrice]
    );
    return result.rows[0];
};

module.exports = { getAllPizzas, getPizzaById, getIngredientsByPizzaId, saveOrder };
