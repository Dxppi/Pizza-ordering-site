-- Создание таблиц
CREATE TABLE pizzas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image TEXT NOT NULL
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    pizza_id INT REFERENCES pizzas(id),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    pizza_id INT REFERENCES pizzas(id),
    ingredients INT[] NOT NULL,
    address TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Feedback (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(id),
    feedback TEXT
);

-- Наполнение данными
INSERT INTO pizzas (name, price, image, description) VALUES
('Маргарита', 500.00, '/images/margarita.jpg', "Томатный соус, сыр моцарелла, томаты, тесто"),
('Пепперони', 600.00, '/images/pepperoni.jpg',"Томатный соус, тесто, сыр моцарелла, пеперони"),
('Вегетарианская', 550.00, '/images/vegetarian.jpg', "Тесто, овощи, сыр моцарелла"),
('Четыре сыра', 700.00, '/images/four-cheese.jpg', 'Томатный соус, сыр моцарелла, сыр гауда, сыр пармезан, сыр рикотта, тесто'),
  ('Вегетарианская', 550.00, '/images/vegetarian.jpg', 'Томатный соус, сыр моцарелла, баклажаны, помидоры, оливки, грибы, тесто'),
  ('Мясная', 750.00, '/images/meat.jpg', 'Томатный соус, сыр моцарелла, куриное филе, бекон, пепперони, сосиски, тесто'),
  ('Барбекю', 700.00, '/images/barbecue.jpg', 'Соус барбекю, сыр моцарелла, куриное филе, лук, грибы, тесто');

INSERT INTO ingredients (pizza_id, name, price) VALUES
  (1, 'Базилик', 20),
  (1, 'Чеснок', 15),
  (1, 'Артишоки', 40),
  (2, 'Чеддер', 60),
  (2, 'Лук', 25),
  (2, 'Паприка', 35),
  (3, 'Бекон', 45),
  (3, 'Моцарелла', 50),
  (3, 'Острый перец', 30),
  (4, 'Горгонзола', 70),
  (4, 'Пармезан', 65),
  (4, 'Фета', 55),
  (5, 'Перец чили', 30),
  (5, 'Петрушка', 20),
  (5, 'Красный лук', 20),
  (6, 'Говядина', 60),
  (6, 'Курица', 50),
  (6, 'Бекон', 45),
  (7, 'Копченая курица', 55),
  (7, 'Грибы шиитаке', 40),
  (7, 'Греческий орех', 25);
