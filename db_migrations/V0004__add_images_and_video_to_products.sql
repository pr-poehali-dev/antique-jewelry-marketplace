ALTER TABLE products
  ADD COLUMN images TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN video_url TEXT NOT NULL DEFAULT '';

UPDATE products SET images = ARRAY[image] WHERE image != '';
