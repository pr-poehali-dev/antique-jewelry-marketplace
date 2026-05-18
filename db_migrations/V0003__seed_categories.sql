INSERT INTO categories (name, sort_order) VALUES
('Мебель', 1),
('Предметы быта', 2),
('Живопись', 3),
('Часы', 4),
('Фарфор', 5)
ON CONFLICT (name) DO NOTHING;
