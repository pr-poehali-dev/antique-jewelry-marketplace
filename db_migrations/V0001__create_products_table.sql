CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  category VARCHAR(100) NOT NULL DEFAULT '',
  era VARCHAR(100) NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO products (name, price, image, category, era, description) VALUES
('Каминные часы Людовика XVI', 45000, 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800', 'Часы', 'XVIII век', 'Редкие бронзовые часы с боем, в стиле неоклассицизм. Полностью рабочий механизм.'),
('Секретер красного дерева', 128000, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 'Мебель', 'XIX век', 'Английский секретер эпохи Регентства. Множество потайных ящиков, оригинальная фурнитура.'),
('Фарфоровая ваза Мейсен', 67000, 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800', 'Фарфор', 'XVIII век', 'Подлинная мейсенская ваза с ручной росписью. Клеймо мастера, без реставраций.'),
('Масло «Венецианский канал»', 89000, 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800', 'Живопись', 'XIX век', 'Итальянская школа живописи. Холст, масло. Оригинальная рама эпохи.'),
('Самовар тульский', 23000, 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800', 'Предметы быта', 'XIX век', 'Серебрёный самовар с монограммой. Тульские мастера, 1887 год.'),
('Бюро маркетри', 195000, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 'Мебель', 'XVIII век', 'Французское бюро с инкрустацией маркетри. Бронзовые золочёные накладки.');
