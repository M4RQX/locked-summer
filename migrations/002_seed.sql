-- Seed default foods. Idempotent via on conflict do nothing.

insert into foods (name, category, kcal, protein_g, carbs_g, fat_g, default_portion, is_default) values
  ('Compal de laranja', 'breakfast', 90, 0, 22, 0, '200ml', true),
  ('Folhado de salsicha', 'breakfast', 350, 10, 30, 22, '1 unidade', true),
  ('Pastel de nata', 'breakfast', 250, 4, 27, 14, '1 unidade', true),
  ('Hambúrguer médio', 'lunch', 550, 30, 40, 30, '1 unidade', true),
  ('Bitoque (carne+ovo+batata+arroz)', 'lunch', 750, 40, 70, 30, '1 dose', true),
  ('Arroz branco cozido', 'lunch', 260, 5, 56, 1, '200g', true),
  ('Carne grelhada', 'lunch', 250, 35, 0, 12, '150g', true),
  ('Salada tomate e pepino', 'lunch', 30, 1, 6, 0, '1 dose', true),
  ('Mass gainer (1 scoop)', 'shake', 950, 50, 150, 10, '250g', true),
  ('Aveia', 'shake', 300, 12, 54, 6, '80g', true),
  ('Leite gordo', 'shake', 180, 10, 14, 10, '300ml', true),
  ('Banana', 'shake', 105, 1, 27, 0, '1 média', true),
  ('Morango', 'shake', 15, 0, 4, 0, '4 unidades', true),
  ('Mel', 'shake', 60, 0, 17, 0, '1 colher (20g)', true),
  ('Ovo cozido', 'snack', 70, 6, 0, 5, '1 unidade', true),
  ('Iogurte grego', 'snack', 130, 15, 5, 5, '150g', true),
  ('Peito de frango', 'lunch', 250, 45, 0, 6, '150g', true),
  ('Atum em conserva', 'snack', 130, 25, 0, 3, '1 lata', true),
  ('Pão de mistura', 'breakfast', 80, 3, 16, 1, '1 fatia', true),
  ('Queijo flamengo', 'snack', 80, 6, 0, 6, '1 fatia', true)
on conflict (name) do nothing;
